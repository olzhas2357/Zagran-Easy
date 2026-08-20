#!/bin/bash
# ============================================================
# ZagranEasy — Project Setup Script
# Run: chmod +x setup.sh && ./setup.sh
# ============================================================

echo "🚀 ZagranEasy — Создаём проект..."

# 1. Create Next.js project
npx create-next-app@latest zagraneasy \
  --typescript --tailwind --eslint \
  --app --src-dir=false --import-alias="@/*" \
  --yes

cd zagraneasy

# 2. Install dependencies
echo "📦 Устанавливаем зависимости..."
npm install framer-motion lucide-react @supabase/supabase-js

# 3. Create directory structure
echo "📁 Создаём структуру..."
mkdir -p app/{education/'[slug]',tours/'[slug]',work,visa-usa,realestate,about,faq,api/leads,staff/{calculator,directory}}
mkdir -p components/{layout,home,ui,shared}
mkdir -p lib data public/images

# 4. Create .env.local
cat > .env.local << 'ENV'
# Supabase (заполнить после создания проекта в supabase.com)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Site
NEXT_PUBLIC_WA_PHONE=77479112606
NEXT_PUBLIC_SITE_URL=https://zagraneasy.kz
ENV

echo ""
echo "✅ Проект создан!"
echo ""
echo "Следующие шаги:"
echo "  1. cd zagraneasy"
echo "  2. Скопируй файлы из архива (lib/, data/, components/)"
echo "  3. npm run dev"
echo "  4. Открой http://localhost:3000"
echo ""
echo "📌 Не забудь:"
echo "  - Создать проект на supabase.com и заполнить .env.local"
echo "  - Добавить изображения в public/images/"
echo "  - Подключить домен на vercel.com"
