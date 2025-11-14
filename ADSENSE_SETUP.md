# Google AdSense 设置指南

## 📋 现状说明

你的项目中 Google AdSense 已经正确集成,但**缺少广告单元**。

### ✅ 已完成的配置

1. **AdSense 脚本加载** - `app/components/google-adsense.tsx` ✅
2. **环境变量配置** - `.env.local` ✅
3. **ads.txt 文件** - `public/ads.txt` ✅
4. **在 layout 中集成** - `app/layout.tsx` ✅

### ❌ 缺少的部分

**广告单元组件** - 需要在页面中插入实际的广告展示位置

---

## 🚀 快速开始

### 第 1 步: 获取广告单元 Slot ID

1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 点击 **广告** → **按广告单元**
3. 创建新的广告单元:
   - **展示广告**: 适合侧边栏、文章中
   - **信息流广告**: 适合文章列表
   - **文章内嵌广告**: 适合文章内容中

4. 复制生成的 **data-ad-slot** ID (例如: `1234567890`)

### 第 2 步: 在代码中使用广告单元

我已经为你创建了广告组件 `app/components/AdUnit.tsx`,现在可以这样使用:

#### 在博客文章中显示广告

```tsx
import { InArticleAd } from 'app/components/AdUnit'

export default function BlogPost() {
  return (
    <>
      <article>
        {/* 文章内容 */}
      </article>

      {/* 在文章底部显示广告 */}
      <InArticleAd slot="你的广告位ID" />
    </>
  )
}
```

#### 在侧边栏显示广告

```tsx
import { SidebarAd } from 'app/components/AdUnit'

<aside>
  <SidebarAd slot="你的广告位ID" />
</aside>
```

#### 在页面顶部显示横幅广告

```tsx
import { BannerAd } from 'app/components/AdUnit'

<header>
  <BannerAd slot="你的广告位ID" />
</header>
```

#### 自定义广告单元

```tsx
import { AdUnit } from 'app/components/AdUnit'

<AdUnit
  slot="你的广告位ID"
  format="auto"
  responsive={true}
  style={{ display: 'block', minHeight: '250px' }}
/>
```

---

## 📍 推荐广告位置

### 1. 博客文章页面 (`app/blog/[slug]/page.tsx`)

已添加示例代码,位置在文章底部:

```tsx
<article className="prose">
  <CustomMDX source={post.content} />
</article>

{/* 文章底部广告 */}
<InArticleAd slot="1234567890" />  {/* ⚠️ 替换为你的真实 Slot ID */}

<SocialShare />
```

### 2. 博客列表页面 (`app/blog/page.tsx`)

```tsx
{/* 在文章列表顶部 */}
<BannerAd slot="你的广告位ID" />

<PostsWithFilter posts={posts} />

{/* 在文章列表底部 */}
<BannerAd slot="你的广告位ID" />
```

### 3. 首页 (`app/page.tsx`)

```tsx
{/* 在特色文章之间 */}
<section>
  <FeaturedArticle />
  <InArticleAd slot="你的广告位ID" />
  <FeaturedArticle />
</section>
```

---

## 🔧 重要配置

### 更新真实的 Slot ID

⚠️ **重要**: 我在示例中使用的是假的 `slot="1234567890"`,你需要:

1. 从 Google AdSense 获取真实的 Slot ID
2. 替换代码中所有的 `"1234567890"`

### 环境变量

确保 `.env.local` 和 Vercel 环境变量中有:

```env
NEXT_PUBLIC_ADSENSE_ID=ca-pub-8944496077703633
```

---

## 🎨 广告样式自定义

在 `app/global.css` 中添加广告样式:

```css
/* 广告容器样式 */
.in-article-ad,
.sidebar-ad,
.banner-ad {
  margin: 2rem 0;
  min-height: 250px;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 暗色模式 */
.dark .in-article-ad,
.dark .sidebar-ad,
.dark .banner-ad {
  background: #1f2937;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar-ad {
    display: none; /* 移动端隐藏侧边栏广告 */
  }
}
```

---

## 🐛 故障排查

### 广告不显示?

1. **检查 AdSense 账号状态**: 确保账号已批准
2. **检查广告单元状态**: 新创建的广告单元可能需要几小时才能生效
3. **检查环境变量**: 确保 `NEXT_PUBLIC_ADSENSE_ID` 配置正确
4. **检查浏览器控制台**: 查看是否有 AdSense 相关错误
5. **禁用广告拦截器**: 测试时关闭 AdBlock 等插件
6. **等待用户交互**: AdSense 脚本设置为延迟加载,需要用户点击/滚动后才加载

### 如何测试广告?

```tsx
// 开发环境测试:在组件中临时显示占位符
<div style={{
  background: '#ffeb3b',
  padding: '20px',
  textAlign: 'center',
  margin: '20px 0'
}}>
  📢 AdSense 广告位置 (测试模式)
  <br />
  Slot ID: 1234567890
</div>
```

---

## 📊 已配置的文件清单

✅ `public/ads.txt` - AdSense 验证文件
✅ `app/components/google-adsense.tsx` - 脚本加载
✅ `app/components/AdUnit.tsx` - 广告单元组件 (新创建)
✅ `app/layout.tsx` - 全局集成
✅ `app/blog/[slug]/page.tsx` - 示例集成
✅ `.env.local` - 环境变量配置

---

## 🎯 下一步操作

1. [ ] 登录 Google AdSense 创建广告单元
2. [ ] 复制每个广告单元的 Slot ID
3. [ ] 在代码中替换 `"1234567890"` 为真实 ID
4. [ ] 在需要显示广告的页面导入并使用广告组件
5. [ ] 部署到 Vercel 并测试
6. [ ] 等待 Google 审核批准(通常 1-2 天)

---

## 💡 提示

- AdSense 需要网站有真实流量才会显示广告
- 开发环境(localhost)可能看不到广告,需要部署到生产环境
- 不要频繁刷新页面测试,可能被 Google 标记为无效流量
- 建议在 2-3 个不同位置放置广告,但不要过多影响用户体验

---

**问题反馈**: 如果遇到问题,检查浏览器控制台的错误信息
