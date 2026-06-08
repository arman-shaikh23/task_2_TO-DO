# AI Performance Notes

## 1 Thing the AI Did Well
**Diagnosing the "Shred Line" Bug:** The AI successfully identified a very obscure browser rendering issue. When the user described a "shred line" appearing after adding 3-4 tasks, the AI realized this was a known Chromium bug caused by nested `.glass` elements with `backdrop-filter: blur()`. It correctly removed the blur from the inner cards, fixing the visual tearing without breaking the premium glassmorphism aesthetic.

## 1 Thing the AI Failed At
**Initial Search Inefficiency:** When trying to locate specific CSS classes (like `.modal-header` and `overflow`), the AI relied on the `grep_search` tool but failed to get results due to search constraints or syntax. It had to fall back to manually reading through the `global.css` file using `view_file`, which cost a bit of time and slowed down the debugging process initially.
