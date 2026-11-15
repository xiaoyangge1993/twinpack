# Twinpack

浏览器里使用的中英双语 **商业发票 / 装箱单** 生成器。一份货物数据同时维护两张单据，本地下载 A4 PDF。数据只写在这台电脑的浏览器里，不会上传。

**这不是报关单，不是中国增值税发票，也不构成法律、税务或海关合规建议。** 页面和每一份导出的 PDF 都会写上这段说明。HS 编码和贸易术语由你自行填写，并须与货代或报关行核对。

在线工具：<https://xiaoyangge1993.github.io/twinpack/>

需要先做报价单或形式发票时，请用配套工具 [Twinform](https://xiaoyangge1993.github.io/twinform/)。

## 本地运行

任意静态服务器即可，例如：

```bash
cd twinpack
python3 -m http.server 4174
```

然后打开 <http://127.0.0.1:4174/>。地址后加 `?demo=1` 可载入虚构示例（北林工作室 / Harbor & Co.，货物和收款信息均为示例）。

## 免费版与 Pro

| 功能 | Free | Pro（计划中） |
| --- | --- | --- |
| 中 / 英 / 中英对照，商业发票与装箱单共用数据，多币种，Logo，Incoterms，唛头，收款栏，重量 / 体积汇总，本机草稿，JSON 导入导出，下载 PDF | 是 | 是 |
| 水印 | 小水印 “Twinpack Free” | 无 |
| 模板 | 经典；现代 / 极简可预览，导出仍带水印 | 经典 / 现代 / 极简，导出无水印 |
| 批量导出草稿 | 锁定 | 可用 |

Pro 已在 Gumroad 上架，现价 12 美元：<https://xiaoxiaoyang.gumroad.com/l/cjxupc>。付款后把 Gumroad license key（或 `TP1_` 补发码）粘贴到工具页即可激活。工具不接受 Twinform 的 `TF1_` 码。面包多即将上线。

## 从 Twinform 导入

若 Twinform 和 Twinpack 开在同一站点源（例如都在 `xiaoyangge1993.github.io`），可读取 Twinform 保存在本机的当前草稿或已存草稿，带入买卖双方、币种、明细和收款栏。包装字段需自行补全。也可以导出 / 导入 JSON，在不同浏览器之间搬数据。

## 浏览器

以桌面版 Chrome、Edge、Firefox、Safari 为目标。PDF 下载使用 html2canvas + jsPDF，中文靠附带的 Noto Sans SC 子集。也可以用「打印 → 另存为 PDF」。

## 许可

你可以使用本工具为自己的工作生成商业发票和装箱单草稿。不得转售或再分发本工具本身。
