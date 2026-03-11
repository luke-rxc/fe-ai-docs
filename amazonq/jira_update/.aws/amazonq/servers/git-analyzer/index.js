#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';

const server = new Server(
  {
    name: 'git-analyzer',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_commits',
        description: 'Analyze git commits for a Jira ticket from current branch',
        inputSchema: {
          type: 'object',
          properties: {
            cwd: {
              type: 'string',
              description: 'Working directory path',
            },
          },
          required: ['cwd'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'analyze_commits') {
    const cwd = request.params.arguments.cwd;
    
    try {
      const branch = execSync('git branch --show-current', { cwd, encoding: 'utf8' }).trim();
      const ticketMatch = branch.match(/FE-\d+/);
      
      if (!ticketMatch) {
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'No ticket number found in branch name' }) }],
        };
      }
      
      const ticket = ticketMatch[0];
      const commitsOutput = execSync(`git log --oneline --grep="${ticket}" --format="%H"`, { cwd, encoding: 'utf8' });
      const commitHashes = commitsOutput.trim().split('\n').filter(line => line);
      
      const commits = [];
      for (const hash of commitHashes) {
        // 커밋 메시지 가져오기
        const message = execSync(`git log -1 --format="%s" ${hash}`, { cwd, encoding: 'utf8' }).trim();
        
        // 해당 커밋만의 변경사항 가져오기 (부모 커밋과 비교)
        const diff = execSync(`git show ${hash} --no-color --format="" --stat`, { cwd, encoding: 'utf8' });
        const files = execSync(`git show ${hash} --no-color --format="" --name-only`, { cwd, encoding: 'utf8' })
          .trim()
          .split('\n')
          .filter(line => line);
        
        commits.push({
          hash,
          message,
          diff,
          files,
        });
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ ticket, commits }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: error.message }) }],
      };
    }
  }
  
  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
