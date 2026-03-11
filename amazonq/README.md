# Amazon Q

Amazon Q를 활용한 개발 생산성 향상 도구 모음

## jira_update

Git 커밋 정보를 자동으로 분석하여 Jira 티켓에 변경 내용을 업데이트하는 Amazon Q 프롬프트

**주요 기능:**
- 현재 브랜치의 Jira 티켓 번호 자동 추출
- 관련 커밋의 diff 자동 수집 및 분석
- Jira 티켓 description에 변경 내용 자동 추가

**설정파일 설치:**
> Amazon Q 설정 파일을 ~/.aws/amazonq/에 복사하고 Node.js 경로를 자동으로 설정합니다.
```bash
cd amazonq/jira_update
## 파일권한 설정
chmod +x install-jira-update.sh 
./install-jira-update.sh
```

**사용 방법:**
1. Jira 티켓 브랜치로 이동 (예: `feature/FE-6109`)
2. Amazon Q 채팅에서 `@jira-update` 입력
3. 분석된 변경 내용 확인 후 업데이트 승인

**상세 설정:** [jira_update/.aws/amazonq/prompts/jira-update-README.md](jira_update/.aws/amazonq/prompts/jira-update-README.md)
