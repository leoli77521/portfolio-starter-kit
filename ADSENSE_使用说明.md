# Google AdSense 使用说明

## ✅ 已完成的配置

### 1. AdSense 脚本 - 已添加
✅ 位置: `app/components/google-adsense.tsx`
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8944496077703633"
     crossorigin="anonymous"></script>
```

### 2. Ads.txt - 已添加
✅ 位置: `public/ads.txt`
```
google.com, pub-8944496077703633, DIRECT, f08c47fec0942fa0
```

### 3. Layout 集成 - 已完成
✅ 位置: `app/layout.tsx:117`
- AdSense 脚本在 `<head>` 中自动加载
- 延迟加载优化(用户交互后才加载)

### 4. 广告单元组件 - 已创建
✅ 位置: `app/components/AdUnit.tsx`

---

## 🚀 如何显示广告

### 第 1 步: 获取广告位 Slot ID

1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 点击左侧菜单 **广告** → **按广告单元**
3. 点击 **创建广告单元**
4. 选择广告类型:
   - **展示广告**: 通用广告,适合大多数位置
   - **信息流广告**: 适合文章列表
   - **文章内嵌广告**: 适合文章内容中

5. 创建后,复制生成的 **data-ad-slot** 数字 (例如: `1234567890`)

### 第 2 步: 在页面中添加广告

#### 方式 1: 文章底部广告 (已添加示例)

文件: `app/blog/[slug]/page.tsx`

```tsx
import { InArticleAd } from 'app/components/AdUnit'

export default function BlogPost() {
  return (
    <>
      <article>
        {/* 文章内容 */}
      </article>

      {/* 替换 YOUR_AD_SLOT_ID 为你的真实 Slot ID */}
      <InArticleAd slot="YOUR_AD_SLOT_ID" />
    </>
  )
}
```

⚠️ **重要**: 将 `YOUR_AD_SLOT_ID` 替换为从 AdSense 获取的真实数字!

#### 方式 2: 博客列表中的广告

文件: `app/blog/page.tsx`

```tsx
import { BannerAd } from 'app/components/AdUnit'

export default function Blog() {
  return (
    <>
      {/* 页面顶部横幅广告 */}
      <BannerAd slot="你的广告位ID" />

      {/* 文章列表 */}
      <PostsWithFilter posts={posts} />

      {/* 页面底部横幅广告 */}
      <BannerAd slot="另一个广告位ID" />
    </>
  )
}
```

#### 方式 3: 首页广告

文件: `app/page.tsx`

```tsx
import { InArticleAd } from 'app/components/AdUnit'

export default function Home() {
  return (
    <>
      {/* 特色内容 */}
      <FeaturedSection />

      {/* 中间插入广告 */}
      <InArticleAd slot="你的广告位ID" />

      {/* 更多内容 */}
      <MoreContent />
    </>
  )
}
```

---

## 📋 可用的广告组件

### 1. InArticleAd - 文章内广告
适合: 文章内容中间或底部
```tsx
<InArticleAd slot="你的广告位ID" />
```

### 2. BannerAd - 横幅广告
适合: 页面顶部、底部
```tsx
<BannerAd slot="你的广告位ID" />
```

### 3. SidebarAd - 侧边栏广告
适合: 页面侧边栏
```tsx
<SidebarAd slot="你的广告位ID" />
```

### 4. DisplayAd - 展示广告
适合: 矩形广告位
```tsx
<DisplayAd slot="你的广告位ID" />
```

### 5. AdUnit - 自定义广告
完全自定义
```tsx
<AdUnit
  slot="你的广告位ID"
  format="auto"
  responsive={true}
  style={{ display: 'block', minHeight: '250px' }}
/>
```

---

## 🎨 广告样式 (可选)

在 `app/global.css` 中添加:

```css
/* 广告容器样式 */
.in-article-ad,
.banner-ad,
.sidebar-ad,
.display-ad {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  margin: 2rem auto;
}

/* 暗色模式 */
.dark .in-article-ad,
.dark .banner-ad,
.dark .sidebar-ad,
.dark .display-ad {
  background: #1f2937;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sidebar-ad {
    display: none; /* 移动端隐藏侧边栏广告 */
  }
}
```

---

## 🔧 完整示例

### 博客文章页面完整示例

```tsx
import { InArticleAd } from 'app/components/AdUnit'

export default function BlogPost({ post }) {
  return (
    <article>
      {/* 文章标题 */}
      <h1>{post.title}</h1>

      {/* 文章内容前半部分 */}
      <div className="content-first-half">
        {/* ... */}
      </div>

      {/* 中间广告 */}
      <InArticleAd slot="1234567890" />

      {/* 文章内容后半部分 */}
      <div className="content-second-half">
        {/* ... */}
      </div>

      {/* 底部广告 */}
      <InArticleAd slot="0987654321" />
    </article>
  )
}
```

---

## 🐛 故障排查

### 问题 1: 广告不显示

**可能原因**:
1. ❌ AdSense 账号未审核通过
2. ❌ 广告位 Slot ID 错误
3. ❌ 使用了 `YOUR_AD_SLOT_ID` 占位符,未替换
4. ❌ 网站在 localhost 开发环境(需部署到生产环境)
5. ❌ 浏览器安装了广告拦截插件
6. ❌ 新创建的广告位需要等待几小时生效

**解决方案**:
- 检查 AdSense 账号状态
- 确认 Slot ID 正确
- 部署到 Vercel 生产环境测试
- 关闭广告拦截插件
- 等待 1-2 小时让新广告位生效

### 问题 2: 广告显示但没有收益

**原因**:
- Google AdSense 需要真实的用户流量
- 自己点击广告不计入收益(可能被标记为无效流量)

**建议**:
- 专注于创造优质内容吸引真实访客
- 不要频繁刷新页面测试
- 不要点击自己网站的广告

### 问题 3: 如何测试广告位置?

在开发环境添加测试占位符:

```tsx
{process.env.NODE_ENV === 'development' ? (
  <div style={{
    background: '#ffeb3b',
    padding: '20px',
    textAlign: 'center',
    margin: '20px 0',
    border: '2px dashed #f57c00'
  }}>
    📢 AdSense 广告位置 (开发模式)
    <br />
    <small>Slot ID: YOUR_AD_SLOT_ID</small>
  </div>
) : (
  <InArticleAd slot="YOUR_AD_SLOT_ID" />
)}
```

---

## 📊 当前配置清单

✅ `public/ads.txt` - AdSense 验证文件
✅ `app/components/google-adsense.tsx` - 脚本加载
✅ `app/components/AdUnit.tsx` - 广告单元组件
✅ `app/layout.tsx` - 全局集成
✅ `app/blog/[slug]/page.tsx` - 示例集成

---

## 🎯 下一步操作

- [ ] 1. 登录 Google AdSense 创建 3-5 个广告单元
- [ ] 2. 复制每个广告单元的 Slot ID
- [ ] 3. 在代码中替换 `YOUR_AD_SLOT_ID` 为真实 ID
- [ ] 4. 在不同页面位置添加广告组件
- [ ] 5. 提交代码并部署到 Vercel
- [ ] 6. 等待 Google AdSense 审核(通常 1-2 天)

---

## 💡 最佳实践

1. **广告数量**: 每个页面 2-3 个广告即可,不要过多
2. **广告位置**:
   - 文章底部(推荐) ✅
   - 文章中间(效果好) ✅
   - 侧边栏(桌面端) ✅
   - 避免在首屏放太多广告 ❌
3. **用户体验**: 广告不应影响阅读体验
4. **响应式**: 使用 `responsive={true}` 自适应不同屏幕

---

## 📞 需要帮助?

- [Google AdSense 帮助中心](https://support.google.com/adsense)
- [AdSense 社区](https://support.google.com/adsense/community)

**记住**: 替换 `YOUR_AD_SLOT_ID` 为你的真实广告位 ID!
