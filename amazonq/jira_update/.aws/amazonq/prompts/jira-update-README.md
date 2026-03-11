# @jira-update 설정 가이드

Git 커밋 정보를 자동으로 분석하여 Jira 티켓에 변경 내용을 업데이트하는 Amazon Q 프롬프트입니다.

## 기능

- 현재 브랜치의 Jira 티켓 번호 자동 추출
- 관련 커밋의 diff 자동 수집 및 분석
- Jira 티켓 description에 변경 내용 자동 추가

## 사전 설정

### Jira API 토큰 발급

1. [Atlassian 계정 설정](https://id.atlassian.com/manage-profile/security/api-tokens) 접속
2. **Create API token** 클릭
3. 토큰 이름 입력 후 **Create** 클릭
4. 생성된 토큰 복사 (이후 다시 확인 불가)

### 환경변수 설정 (JIRA_USER / JIRA_TOKEN)

토큰을 평문으로 저장하지 않도록 macOS Keychain을 활용한다. **최초 1회만** 설정하면 이후 VSCode 실행 시 자동으로 적용된다.

**1. Keychain에 토큰 저장 (최초 1회)**
```bash
security add-generic-password -a "$USER" -s "JIRA_TOKEN" -w "your-jira-api-token"
```

**2. `~/.zprofile`에 추가** (앱 아이콘으로 VSCode 실행 시에도 적용됨)
```bash
export JIRA_USER="your-email@example.com"
export JIRA_TOKEN=$(security find-generic-password -a "$USER" -s "JIRA_TOKEN" -w)
```

> `~/.zshrc`는 터미널에서 VSCode를 실행(`code .`)할 때만 로드되므로, 앱 실행 방식과 무관하게 동작하려면 `~/.zprofile`을 사용한다.

## 설치

### 1. MCP 서버 의존성 설치

```bash
cd ~/.aws/amazonq/servers/git-analyzer
npm install
```

### 2. Amazon Q 재시작

IDE에서 Amazon Q를 재시작하여 MCP 서버를 활성화합니다.

## 파일 구조

```
~/.aws/amazonq/
├── mcp.json                              # MCP 서버 설정
├── prompts/
│   └── jira-update.md                    # 프롬프트 정의
└── servers/
    └── git-analyzer/
        ├── package.json                  # 의존성 정의
        └── index.js                      # MCP 서버 구현
```

## 사용 방법

1. Jira 티켓 브랜치로 이동 (예: `feature/FE-6109`)
2. Amazon Q 채팅에서 `@jira-update` 입력
3. 분석된 변경 내용 확인
4. 업데이트 승인

## 설정 파일

### mcp.json

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-jira"],
      "env": {
        "JIRA_URL": "https://your-domain.atlassian.net",
        "JIRA_EMAIL": "${JIRA_USER}",
        "JIRA_API_TOKEN": "${JIRA_TOKEN}"
      }
    },
    "git-analyzer": {
      "command": "node",
      "args": ["/Users/username/.aws/amazonq/servers/git-analyzer/index.js"]
    }
  }
}
```

### jira-update.md

프롬프트 실행 흐름:
1. git-analyzer MCP 서버로 커밋 정보 수집
2. diff 분석 및 변경 내용 정리
3. Jira API로 티켓 description 조회
4. 사용자에게 변경 내용 미리보기
5. 승인 후 Jira 티켓 업데이트

## 출력 형식

Jira 티켓에 추가되는 내용:

```
---
변경 내용:

• 커밋 메시지 1
  • 추가된 함수/API 설명
  • 수정된 로직 설명
  • 파일 경로 (code 형식)

• 커밋 메시지 2
  • 변경 사항 상세
```

## 문제 해결

### MCP 서버가 인식되지 않는 경우
- Amazon Q 재시작
- `~/.aws/amazonq/servers/git-analyzer/` 경로 확인
- `npm install` 실행 여부 확인

### 티켓 번호를 찾을 수 없는 경우
- 브랜치명이 `feature/FE-XXXX` 패턴인지 확인
- 커밋 메시지에 티켓 번호가 포함되어 있는지 확인

### Jira API 인증 실패
- `mcp.json`의 `JIRA_API_TOKEN` 확인
- Jira API 토큰 유효성 확인

## 요구사항

- Node.js 설치
- Git 저장소
- Jira API 토큰
- Amazon Q IDE 플러그인
