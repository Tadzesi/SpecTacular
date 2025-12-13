import * as vscode from 'vscode';
import * as path from 'path';

export interface TaskFrontmatter {
  type?: string;
  status?: string;
  created?: string;
}

export interface TaskParseResult {
  frontmatter: TaskFrontmatter;
  frontmatterStart: number;
  frontmatterEnd: number;
  acceptanceCriteria: AcceptanceCriterion[];
  allCriteriaChecked: boolean;
  content: string;
}

export interface AcceptanceCriterion {
  line: number;
  text: string;
  checked: boolean;
}

/**
 * Service for managing task file status based on acceptance criteria
 */
export class TaskStatusService {
  private static instance: TaskStatusService;
  private _disposables: vscode.Disposable[] = [];

  public static getInstance(): TaskStatusService {
    if (!TaskStatusService.instance) {
      TaskStatusService.instance = new TaskStatusService();
    }
    return TaskStatusService.instance;
  }

  /**
   * Check if a file is a task file (in tasks folder with task frontmatter)
   */
  public isTaskFile(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
    // Check if file is in a tasks folder and is a markdown file
    return normalizedPath.includes('/tasks/') &&
           (normalizedPath.endsWith('.md') || normalizedPath.endsWith('.markdown'));
  }

  /**
   * Parse a task file and extract frontmatter and acceptance criteria
   */
  public parseTaskFile(content: string): TaskParseResult | null {
    const lines = content.split('\n');

    // Find frontmatter boundaries
    let frontmatterStart = -1;
    let frontmatterEnd = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '---') {
        if (frontmatterStart === -1) {
          frontmatterStart = i;
        } else {
          frontmatterEnd = i;
          break;
        }
      }
    }

    // No valid frontmatter found
    if (frontmatterStart === -1 || frontmatterEnd === -1) {
      return null;
    }

    // Parse frontmatter
    const frontmatter: TaskFrontmatter = {};
    for (let i = frontmatterStart + 1; i < frontmatterEnd; i++) {
      const line = lines[i];
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        if (key === 'type') frontmatter.type = value;
        else if (key === 'status') frontmatter.status = value;
        else if (key === 'created') frontmatter.created = value;
      }
    }

    // Check if this is a task file
    if (frontmatter.type !== 'task') {
      return null;
    }

    // Find acceptance criteria (checkboxes)
    const acceptanceCriteria: AcceptanceCriterion[] = [];
    let inAcceptanceCriteria = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for Acceptance Criteria header
      if (line.match(/^##\s+Acceptance\s+Criteria/i)) {
        inAcceptanceCriteria = true;
        continue;
      }

      // Check for next section header (end of acceptance criteria)
      if (inAcceptanceCriteria && line.match(/^##\s+/)) {
        inAcceptanceCriteria = false;
        continue;
      }

      // Parse checkboxes in acceptance criteria section
      if (inAcceptanceCriteria) {
        const checkboxMatch = line.match(/^-\s*\[([ xX])\]\s*(.*)$/);
        if (checkboxMatch) {
          acceptanceCriteria.push({
            line: i,
            text: checkboxMatch[2],
            checked: checkboxMatch[1].toLowerCase() === 'x'
          });
        }
      }
    }

    const allCriteriaChecked = acceptanceCriteria.length > 0 &&
                               acceptanceCriteria.every(c => c.checked);

    return {
      frontmatter,
      frontmatterStart,
      frontmatterEnd,
      acceptanceCriteria,
      allCriteriaChecked,
      content
    };
  }

  /**
   * Update the status in frontmatter based on acceptance criteria
   */
  public updateTaskStatus(content: string, newStatus: string): string {
    const lines = content.split('\n');

    // Find frontmatter boundaries and status line
    let frontmatterStart = -1;
    let frontmatterEnd = -1;
    let statusLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '---') {
        if (frontmatterStart === -1) {
          frontmatterStart = i;
        } else {
          frontmatterEnd = i;
          break;
        }
      } else if (frontmatterStart !== -1 && frontmatterEnd === -1) {
        if (line.startsWith('status:')) {
          statusLineIndex = i;
        }
      }
    }

    if (statusLineIndex !== -1) {
      // Update existing status line
      lines[statusLineIndex] = `status: ${newStatus}`;
    } else if (frontmatterStart !== -1 && frontmatterEnd !== -1) {
      // Add status line before closing ---
      lines.splice(frontmatterEnd, 0, `status: ${newStatus}`);
    }

    return lines.join('\n');
  }

  /**
   * Find the main tasks.md file for a given task file
   */
  public async findMainTasksFile(taskFilePath: string): Promise<string | null> {
    const normalizedPath = taskFilePath.replace(/\\/g, '/');

    // Task files are in: specs/<feature>/tasks/<task>.md
    // Main tasks.md is at: specs/<feature>/tasks.md
    const tasksMatch = normalizedPath.match(/(.+)\/tasks\/[^/]+\.md$/i);
    if (tasksMatch) {
      const featureDir = tasksMatch[1];
      const mainTasksPath = `${featureDir}/tasks.md`;

      try {
        const uri = vscode.Uri.file(mainTasksPath);
        await vscode.workspace.fs.stat(uri);
        return mainTasksPath;
      } catch {
        // File doesn't exist
      }
    }

    return null;
  }

  /**
   * Update the status tag in the main tasks.md table for a specific task
   */
  public async updateMainTasksTable(
    mainTasksPath: string,
    taskFileName: string,
    newStatus: string
  ): Promise<boolean> {
    try {
      const uri = vscode.Uri.file(mainTasksPath);
      const contentBytes = await vscode.workspace.fs.readFile(uri);
      const content = Buffer.from(contentBytes).toString('utf8');

      const lines = content.split('\n');
      const taskBaseName = path.basename(taskFileName, '.md');
      let updated = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Look for table rows containing the task link
        // Format: | [01-html-structure](./tasks/01-html-structure.md) | Description | #status/pending |
        if (line.includes(`(./tasks/${taskBaseName}.md)`) ||
            line.includes(`[${taskBaseName}]`)) {
          // Replace status tag
          const statusTag = newStatus === 'done' ? '#status/done' :
                           newStatus === 'in-progress' ? '#status/in-progress' :
                           '#status/pending';

          // Replace any existing status tag
          lines[i] = line.replace(
            /#status\/(done|complete|pending|in-progress|blocked|skipped)/gi,
            statusTag
          );
          updated = true;
        }
      }

      if (updated) {
        const newContent = lines.join('\n');
        const encoder = new TextEncoder();
        await vscode.workspace.fs.writeFile(uri, encoder.encode(newContent));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to update main tasks table:', error);
      return false;
    }
  }

  /**
   * Process a task file change and update status if needed
   */
  public async processTaskFileChange(filePath: string): Promise<{
    statusChanged: boolean;
    oldStatus: string | undefined;
    newStatus: string | undefined;
    mainTasksUpdated: boolean;
  }> {
    const result = {
      statusChanged: false,
      oldStatus: undefined as string | undefined,
      newStatus: undefined as string | undefined,
      mainTasksUpdated: false
    };

    if (!this.isTaskFile(filePath)) {
      return result;
    }

    try {
      const uri = vscode.Uri.file(filePath);
      const contentBytes = await vscode.workspace.fs.readFile(uri);
      const content = Buffer.from(contentBytes).toString('utf8');

      const parseResult = this.parseTaskFile(content);
      if (!parseResult) {
        return result;
      }

      result.oldStatus = parseResult.frontmatter.status;

      // Determine new status based on acceptance criteria
      const shouldBeDone = parseResult.allCriteriaChecked;
      const currentStatus = parseResult.frontmatter.status?.toLowerCase();

      // Only change status if it needs to change
      if (shouldBeDone && currentStatus !== 'done') {
        result.newStatus = 'done';
      } else if (!shouldBeDone && currentStatus === 'done') {
        result.newStatus = 'pending';
      }

      if (result.newStatus && result.newStatus !== result.oldStatus) {
        result.statusChanged = true;

        // Update the task file
        const updatedContent = this.updateTaskStatus(content, result.newStatus);
        const encoder = new TextEncoder();
        await vscode.workspace.fs.writeFile(uri, encoder.encode(updatedContent));

        // Update main tasks.md table
        const mainTasksPath = await this.findMainTasksFile(filePath);
        if (mainTasksPath) {
          result.mainTasksUpdated = await this.updateMainTasksTable(
            mainTasksPath,
            path.basename(filePath),
            result.newStatus
          );
        }

        // Show notification
        const statusLabel = result.newStatus === 'done' ? 'Done' : 'Pending';
        vscode.window.setStatusBarMessage(
          `Task status updated: ${path.basename(filePath)} → ${statusLabel}`,
          3000
        );
      }

      return result;
    } catch (error) {
      console.error('Failed to process task file:', error);
      return result;
    }
  }

  public dispose() {
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
