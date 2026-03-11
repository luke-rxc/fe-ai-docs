#!/bin/bash
echo "========================================"
echo "Amazon Q Jira Update 설정 스크립트"
echo "========================================"
echo ""
echo "이 스크립트는 다음 작업을 수행합니다:"
echo "1. Amazon Q 설정 파일을 ~/.aws/amazonq/에 복사"
echo "2. 시스템의 Node.js 경로를 자동으로 감지"
echo "3. mcp.json에 Node.js 경로 자동 설정"
echo ""
read -p "작업을 시작하시겠습니까? (y/N): " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "작업이 취소되었습니다."
  exit 0
fi
echo ""
echo "설정 파일 복사 시작"
cp -r -v ./.aws ~
echo "설정 파일 복사 완료"

NODE_PATH=$(which node 2>/dev/null || find ~/.nvm/versions/node -name "node" -type f 2>/dev/null | sort -V | tail -1)

if [ -z "$NODE_PATH" ]; then
  echo "node를 찾을 수 없습니다"
  exit 1
fi

MCP_JSON="$HOME/.aws/amazonq/mcp.json"
sed -i '' "s|\"command\": \".*node\"|\"command\": \"$NODE_PATH\"|" "$MCP_JSON"
echo ""
echo "$MCP_JSON - Node.js 경로 설정 완료: $NODE_PATH"
echo ""
echo "========================================"
echo "작업이 완료되었습니다!"
echo "Amazon Q를 재시작하여 변경사항을 적용하세요."
echo "========================================"
