import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'SpecTacular',
    description: 'Specification-driven development toolkit',
    base: '/SpecTacular/',

    ignoreDeadLinks: true, // Temporarily ignore dead links during development

    head: [
      ['link', { rel: 'icon', href: '/SpecTacular/logo.svg' }]
    ],

    themeConfig: {
      logo: '/logo.svg',

      nav: [
        { text: 'Guide', link: '/guide/' },
        { text: 'Architecture', link: '/architecture/' },
        { text: 'API', link: '/api/extension/' },
        {
          text: 'v1.6.4',
          items: [
            { text: 'Changelog', link: '/reference/changelog' },
            { text: 'GitHub', link: 'https://github.com/Tadzesi/SpecTacular' }
          ]
        }
      ],

      sidebar: {
        '/guide/': [
          {
            text: 'Getting Started',
            collapsed: false,
            items: [
              { text: 'Installation', link: '/getting-started/' },
              { text: 'Quick Start', link: '/getting-started/quick-start' },
              { text: 'Configuration', link: '/getting-started/configuration' }
            ]
          },
          {
            text: 'CLI Tool',
            collapsed: false,
            items: [
              { text: 'Overview', link: '/guide/cli/' },
              { text: 'Commands', link: '/guide/cli/commands' },
              { text: 'Templates', link: '/guide/cli/templates' }
            ]
          },
          {
            text: 'VS Code Extension',
            collapsed: false,
            items: [
              { text: 'Overview', link: '/guide/extension/' },
              { text: 'Features', link: '/guide/extension/features' },
              { text: 'Shortcuts', link: '/guide/extension/keyboard-shortcuts' }
            ]
          },
          {
            text: 'Workflows',
            collapsed: false,
            items: [
              { text: 'Specification Pipeline', link: '/guide/workflows/specification-pipeline' },
              { text: 'Task Management', link: '/guide/workflows/task-management' },
              { text: 'Status Tags', link: '/guide/workflows/status-tags' }
            ]
          }
        ],
        '/architecture/': [
          {
            text: 'Architecture',
            items: [
              { text: 'Overview', link: '/architecture/' },
              { text: 'CLI Architecture', link: '/architecture/cli' },
              { text: 'Extension Architecture', link: '/architecture/extension' },
              { text: 'Webview Architecture', link: '/architecture/webview' },
              { text: 'Message Protocol', link: '/architecture/message-protocol' },
              { text: 'Data Flow', link: '/architecture/data-flow' }
            ]
          }
        ],
        '/development/': [
          {
            text: 'Development',
            items: [
              { text: 'Setup', link: '/development/setup' },
              { text: 'Building', link: '/development/building' },
              { text: 'Testing', link: '/development/testing' },
              { text: 'Contributing', link: '/development/contributing' },
              { text: 'Release Process', link: '/development/release-process' }
            ]
          }
        ]
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com/Tadzesi/SpecTacular' }
      ],

      search: {
        provider: 'local'
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2024-present SpecTacular Contributors'
      }
    },

    markdown: {
      theme: 'github-dark'
    }
  })
)
