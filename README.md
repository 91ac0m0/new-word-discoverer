## TODO

- [x] 翻译接口
- [ ] 词语收藏和删除接口
- [ ] popup 面板，可以进行 highlight style、显示比例的修改
    - [x] 选择语言
    - [x] 比例和 list
    - [x] 选择高亮的样式
    - [ ] 高亮本页
- [ ] 选择 dark light 样式
- [ ] 添加自定义的词库
- [ ] 在 new tab 随机显示收藏的词语
- [ ] 要不要把数据移动到 service worker...
- [ ] 增加 white black list 逻辑

https://github.com/crimx/ext-saladict/blob/ffb478cd2e3277a40edeb9470ad1c6614b010028/src/components/dictionaries/google/engine.ts#L26

写一个函数负责从 google 翻译拿结果
word lang
word_translate

star_list
delete_list & 从列表里面删除

popup 面板修改 config

## 相关
https://crxjs.dev/vite-plugin
https://github.com/DarinRowe/googletrans
https://tw-elements.com/docs/standard/getting-started/quick-start/