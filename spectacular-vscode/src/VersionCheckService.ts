import * as vscode from 'vscode';
import * as https from 'https';

export interface VersionInfo {
  currentVersion: string;
  latestVersion: string | null;
  updateAvailable: boolean;
  releaseUrl: string;
}

export class VersionCheckService {
  private static instance: VersionCheckService;
  private static readonly GITHUB_RELEASES_URL = 'https://github.com/Tadzesi/SpecTacular/releases';
  private static readonly GITHUB_API_URL = 'https://api.github.com/repos/Tadzesi/SpecTacular/releases/latest';

  private cachedVersionInfo: VersionInfo | null = null;
  private hasShownNotification = false;

  public static getInstance(): VersionCheckService {
    if (!VersionCheckService.instance) {
      VersionCheckService.instance = new VersionCheckService();
    }
    return VersionCheckService.instance;
  }

  public getCurrentVersion(): string {
    const extension = vscode.extensions.getExtension('spectacular.spectacular-dashboard');
    return extension?.packageJSON?.version ?? 'unknown';
  }

  public async checkForUpdates(): Promise<VersionInfo> {
    // Return cached result if available
    if (this.cachedVersionInfo) {
      return this.cachedVersionInfo;
    }

    const currentVersion = this.getCurrentVersion();

    try {
      const latestVersion = await this.fetchLatestVersion();
      const updateAvailable = latestVersion ? this.isNewerVersion(latestVersion, currentVersion) : false;

      this.cachedVersionInfo = {
        currentVersion,
        latestVersion,
        updateAvailable,
        releaseUrl: VersionCheckService.GITHUB_RELEASES_URL
      };

      return this.cachedVersionInfo;
    } catch (error) {
      console.error('Failed to check for updates:', error);

      // Return current version info without update check
      this.cachedVersionInfo = {
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: VersionCheckService.GITHUB_RELEASES_URL
      };

      return this.cachedVersionInfo;
    }
  }

  public async showUpdateNotificationIfNeeded(): Promise<void> {
    if (this.hasShownNotification) {
      return;
    }

    const versionInfo = await this.checkForUpdates();

    if (versionInfo.updateAvailable && versionInfo.latestVersion) {
      this.hasShownNotification = true;

      const updateAction = 'View Release';
      const result = await vscode.window.showInformationMessage(
        `SpecTacular v${versionInfo.latestVersion} is available! You're using v${versionInfo.currentVersion}.`,
        updateAction
      );

      if (result === updateAction) {
        vscode.env.openExternal(vscode.Uri.parse(versionInfo.releaseUrl));
      }
    }
  }

  public getVersionInfo(): VersionInfo | null {
    return this.cachedVersionInfo;
  }

  private fetchLatestVersion(): Promise<string | null> {
    return new Promise((resolve) => {
      const options = {
        hostname: 'api.github.com',
        path: '/repos/Tadzesi/SpecTacular/releases/latest',
        method: 'GET',
        headers: {
          'User-Agent': 'SpecTacular-VSCode-Extension',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const release = JSON.parse(data);
              // Tag name is usually "v1.5.0" - strip the "v" prefix
              const tagName = release.tag_name || '';
              const version = tagName.startsWith('v') ? tagName.substring(1) : tagName;
              resolve(version || null);
            } else {
              console.log(`GitHub API returned status ${res.statusCode}`);
              resolve(null);
            }
          } catch (error) {
            console.error('Failed to parse GitHub release response:', error);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        console.error('Failed to fetch latest version:', error);
        resolve(null);
      });

      // Set a timeout
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(null);
      });

      req.end();
    });
  }

  private isNewerVersion(latest: string, current: string): boolean {
    try {
      const latestParts = latest.split('.').map(Number);
      const currentParts = current.split('.').map(Number);

      for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
        const latestPart = latestParts[i] || 0;
        const currentPart = currentParts[i] || 0;

        if (latestPart > currentPart) {
          return true;
        }
        if (latestPart < currentPart) {
          return false;
        }
      }

      return false;
    } catch {
      return false;
    }
  }
}
