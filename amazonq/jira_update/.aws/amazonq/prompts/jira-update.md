1. git-analyzer MCP 서버의 `analyze_commits` 도구를 호출하여 현재 브랜치의 커밋 정보를 수집한다 (자동으로 Run).
2. 반환된 커밋 정보(ticket, commits)를 분석하여 상세한 변경 내용을 정리한다:
   - **중요**: 각 커밋의 diff를 개별적으로 분석하여 해당 티켓 번호가 포함된 커밋만 처리
   - 추가된 함수/API/컴포넌트
   - 수정된 로직 및 파라미터
   - 삭제된 코드 및 상수
   - 의존성 변경사항
   - 커밋 메시지를 기반으로 기능별로 그룹화
3. `GET /rest/api/3/issue/{ticket}` 로 현재 티켓의 description을 가져온다
4. Jira 티켓 description 하단에 추가될 내용을 아래 형식으로 먼저 사용자에게 보여준다
5. 사용자 확인 후 기존 description의 `content` 배열 끝에 아래 내용을 추가하여 `PUT /rest/api/3/issue/{ticket}` 로 업데이트한다
   - description이 null인 경우 새로운 doc으로 생성한다

추가 내용 형식 (Atlassian Document Format):
- 구분선 (rule 노드)
- "변경 내용:" bold 텍스트 paragraph
- 변경사항 bulletList (커밋 메시지를 기반으로 그룹화)
  - 각 항목은 커밋 메시지를 제목으로 사용
  - 하위 bulletList에 상세 변경 내용 포함:
    - 추가/수정/삭제된 함수, API, 컴포넌트 등
    - 주요 로직 변경사항
    - 파일 경로는 code 마크로 표시
