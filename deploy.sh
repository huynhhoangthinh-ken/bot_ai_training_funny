#!/bin/bash
# ==============================================================================
# SCRIPT DEPLOY SIÊU TỐC: TỰ ĐỘNG GIT PUSH & CLOUDFLARE PAGES DIRECT DEPLOY
# ==============================================================================

# 1. Đặt tên project Cloudflare Pages của website đó (Thay tên dự án của bạn vào đây)
PROJECT_NAME="bot-ai-hai-huoc"
CUSTOM_DOMAIN="funnytraining.daichung.com.vn" # (Nếu có)

# 2. Lấy thông điệp commit (mặc định nếu không truyền tham số)
COMMIT_MSG="${1:-Auto update and deploy website}"

echo "🚀 [1/3] Kiểm tra và gom tất cả thay đổi (Staging)..."
git add -A

# Kiểm tra nếu có thay đổi mới commit
if git diff-index --quiet HEAD --; then
    echo "ℹ️  Không có thay đổi mới trong mã nguồn Git."
else
    echo "📦 [2/3] Đang Commit & Push lên GitHub origin main..."
    git commit -m "$COMMIT_MSG"
    git push origin main
fi

echo "⛅ [3/3] Đang bắn trực tiếp lên Cloudflare Pages ($PROJECT_NAME)..."
# wrangler sẽ tự so khớp mã băm và chỉ upload những file có thay đổi
npx -y wrangler pages deploy . --project-name="$PROJECT_NAME" --commit-dirty=true

echo "✅ Deploy hoàn tất siêu tốc!"
if [ -n "$CUSTOM_DOMAIN" ]; then
    echo "🌐 Website trực tuyến: https://$CUSTOM_DOMAIN"
fi
