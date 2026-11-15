/* Twinpack — bilingual commercial invoice / packing list generator.
   All document data stays in this browser. No uploads. */
(() => {
  const STORAGE_CURRENT = "twinpack.current.v1";
  const STORAGE_DRAFTS = "twinpack.drafts.v1";
  const STORAGE_LICENSE = "twinpack.license.v1";
  const STORAGE_UI = "twinpack.uiLang.v1";
  const TWINFORM_CURRENT = "twinform.current.v1";
  const TWINFORM_DRAFTS = "twinform.drafts.v1";

  const DISCLAIMER_BANNER = {
    zh: "本文件为商业发票或装箱单（commercial invoice / packing list）草稿，不是报关单，不是中国增值税发票，也不是任何海关或税务机关出具或认可的文件。本工具不计算应纳税额或关税，不对 HS 编码做归类，不构成法律、税务或海关合规建议。贸易术语、原产国、港口、重量、体积和编码均由你自行填写，仅用于展示，须自行与货代或报关行核对。所有数据只保存在本机浏览器，不会上传到服务器。",
    en: "This document is a commercial invoice or packing list draft. It is not a customs declaration, not a China VAT invoice, and is not issued or endorsed by any customs or tax authority. This tool does not calculate tax or duty, does not classify HS codes, and does not constitute legal, tax, or customs-compliance advice. Incoterms, origin, ports, weights, volume, and codes are entered by you and shown for document purposes only; confirm them with your forwarder or broker. All data stays in this browser and is not uploaded to a server.",
  };

  const DISCLAIMER = {
    zh: "本文件为商业发票或装箱单草稿，不是报关单或增值税发票，也不构成法律、税务或海关合规建议。字段由使用者自行填写并须自行核对。数据只保存在本机浏览器。",
    en: "This is a commercial invoice or packing list draft — not a customs form or tax invoice, and not legal, tax, or customs advice. Values are entered by the user. Data stays in this browser.",
  };

  const CURRENCIES = {
    USD: { symbol: "$", digits: 2 },
    EUR: { symbol: "€", digits: 2 },
    CNY: { symbol: "¥", digits: 2 },
    GBP: { symbol: "£", digits: 2 },
    JPY: { symbol: "¥", digits: 0 },
    HKD: { symbol: "HK$", digits: 2 },
    SGD: { symbol: "S$", digits: 2 },
    AUD: { symbol: "A$", digits: 2 },
    CAD: { symbol: "C$", digits: 2 },
  };

  const INCOTERMS = ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP", "OTHER"];
  const TRANSPORTS = [
    { id: "sea", zh: "海运", en: "Sea freight" },
    { id: "air", zh: "空运", en: "Air freight" },
    { id: "courier", zh: "快递", en: "Courier" },
    { id: "rail", zh: "铁路", en: "Rail" },
    { id: "road", zh: "公路", en: "Road" },
    { id: "other", zh: "其他", en: "Other" },
  ];

  const TEMPLATES = [
    { id: "classic", zh: "经典", en: "Classic", pro: false },
    { id: "modern", zh: "现代", en: "Modern", pro: true },
    { id: "minimal", zh: "极简", en: "Minimal", pro: true },
  ];
  const I18N = {
    zh: {
      tagline: "双语商业发票与装箱单",
      invoice: "商业发票",
      packing: "装箱单",
      langZh: "中文",
      langEn: "English",
      langBoth: "中英对照",
      currency: "币种",
      drafts: "草稿",
      saveDraft: "存为草稿",
      exportPdf: "下载当前 PDF",
      exportBoth: "下载两份 PDF",
      print: "打印 / 另存为 PDF",
      example: "载入示例",
      seller: "卖方信息",
      client: "买方 / 收货人",
      items: "货物明细（两张单据共用）",
      addItem: "添加一行",
      shipment: "运输与贸易术语",
      payment: "收款信息（由你自行填写，印在商业发票上）",
      notes: "备注",
      legal: "请先读这一段",
      name: "名称",
      nameEn: "英文名称",
      address: "地址",
      addressEn: "英文地址",
      email: "邮箱",
      phone: "电话",
      website: "网站",
      taxId: "税号 / 登记号（可选，原样打印）",
      logo: "公司 Logo",
      uploadLogo: "上传图片",
      removeLogo: "移除",
      invoiceNo: "商业发票号",
      packingNo: "装箱单号",
      issueDate: "日期",
      incoterms: "贸易术语",
      incotermsPlace: "地点（如 Ningbo）",
      incotermsYear: "版本年份",
      transport: "运输方式",
      origin: "原产国",
      departure: "起运港 / 起运地",
      destination: "目的港 / 目的地",
      vessel: "船名 / 航班 / 运单号（可选）",
      marks: "唛头",
      payTerms: "付款条款（印在商业发票上）",
      desc: "描述",
      descEn: "英文描述",
      hs: "HS 编码（可选，原样打印）",
      qty: "数量",
      unit: "单位",
      unitPrice: "单价",
      cartons: "箱数",
      cartonFrom: "起始箱号（可空，自动连续）",
      netWeight: "净重合计 kg",
      grossWeight: "毛重合计 kg",
      length: "长 cm（每箱）",
      width: "宽 cm",
      height: "高 cm",
      amount: "金额",
      paypal: "PayPal",
      wise: "Wise",
      payoneer: "Payoneer",
      bank: "银行转账",
      paypalEmail: "PayPal 邮箱",
      wiseId: "Wise 邮箱或账户",
      payoneerId: "Payoneer 邮箱或账户",
      bankName: "银行名称",
      accountName: "账户名",
      accountNo: "账号",
      swift: "SWIFT / BIC",
      bankAddr: "开户行地址",
      payExtra: "其他付款说明",
      proTitle: "Pro 功能",
      proHint: "有效许可证可去掉水印并解锁批量导出。可粘贴 Gumroad 付款后收到的 license key，或以 TP1_ 开头的签名码。现代 / 极简模板可随时预览，未激活时导出仍带水印。购买入口指向 Gumroad；面包多即将上线。Twinform 的 TF1_ 码不能在这里激活。",
      licenseLabel: "许可证",
      licensePlaceholder: "粘贴 Gumroad license key，或以 TP1_ 开头的签名码（空格和换行会被忽略）",
      licenseActivate: "激活",
      licenseActivated: "许可证已在本机激活。去水印和批量导出已解锁。",
      licenseClear: "移除本机许可证",
      licenseInvalid: "这不是有效的 Twinpack 许可证。请检查是否完整粘贴，或确认不是 Twinform 的 TF1_ 码。",
      licenseEmpty: "请先粘贴许可证。",
      licenseBusy: "正在校验…",
      licenseNetwork: "暂时无法校验购买许可证，请检查网络后重试。",
      licenseRevoked: "这份许可证已退款或发生争议，无法激活。",
      licenseSoon: "暂时无法校验购买许可证。若你持有已签发的 Twinpack TP1_ 码，可以在这里激活。",
      buyCta: "购买 Pro · $12",
      buyHelp: "购买说明",
      template: "模板",
      locked: "可预览",
      batch: "批量导出",
      batchHint: "从已存草稿中勾选，依次下载当前类型的 PDF。未激活许可证时此功能锁定。",
      overflow: "内容可能超出一页，请减少行数或备注后再导出。",
      fit: "预览已按窗口缩放，导出仍为 A4。",
      saved: "已自动保存到本机",
      draftName: "草稿名称",
      load: "打开",
      del: "删除",
      close: "关闭",
      noDrafts: "还没有已存草稿。",
      watermark: "Twinpack Free",
      importJson: "导入 JSON",
      exportJson: "导出 JSON",
      importTwinform: "从 Twinform 导入",
      noTwinform: "在本站点源没有找到 Twinform 草稿。若两个工具不在同一域名下，请先在 Twinform 导出 JSON，或使用下方文件导入。",
      importTitle: "导入",
      importHint: "可从同一站点源读取 Twinform 草稿（例如都在 github.io），或导入 Twinpack / Twinform 的 JSON 文件。包装字段导入后请补全。",
      pickFile: "选择 JSON 文件",
      imported: "已导入，请核对包装、重量和贸易术语。",
      jsonError: "无法读取这个 JSON 文件。",
      paymentTitle: "付款方式 / Payment",
      notesTitle: "备注 / Notes",
    },
    en: {
      tagline: "Bilingual commercial invoices & packing lists",
      invoice: "Commercial Invoice",
      packing: "Packing List",
      langZh: "中文",
      langEn: "English",
      langBoth: "Bilingual",
      currency: "Currency",
      drafts: "Drafts",
      saveDraft: "Save draft",
      exportPdf: "Download this PDF",
      exportBoth: "Download both PDFs",
      print: "Print / Save as PDF",
      example: "Load example",
      seller: "Seller / shipper",
      client: "Buyer / consignee",
      items: "Goods (shared by both documents)",
      addItem: "Add line",
      shipment: "Shipment & Incoterms",
      payment: "Payment details (entered by you; printed on the commercial invoice)",
      notes: "Notes",
      legal: "Please read this first",
      name: "Name",
      nameEn: "Name in English",
      address: "Address",
      addressEn: "Address in English",
      email: "Email",
      phone: "Phone",
      website: "Website",
      taxId: "Tax / registration ID (optional, printed as-is)",
      logo: "Logo",
      uploadLogo: "Upload image",
      removeLogo: "Remove",
      invoiceNo: "Commercial invoice no.",
      packingNo: "Packing list no.",
      issueDate: "Date",
      incoterms: "Incoterms",
      incotermsPlace: "Named place (e.g. Ningbo)",
      incotermsYear: "Year / edition",
      transport: "Mode of transport",
      origin: "Country of origin",
      departure: "Port / place of loading",
      destination: "Port / place of destination",
      vessel: "Vessel / flight / tracking (optional)",
      marks: "Shipping marks",
      payTerms: "Payment terms (on the commercial invoice)",
      desc: "Description",
      descEn: "Description in English",
      hs: "HS code (optional, printed as-is)",
      qty: "Qty",
      unit: "Unit",
      unitPrice: "Unit price",
      cartons: "Cartons",
      cartonFrom: "First carton no. (optional, auto-numbered)",
      netWeight: "Total net kg",
      grossWeight: "Total gross kg",
      length: "Length cm (per carton)",
      width: "Width cm",
      height: "Height cm",
      amount: "Amount",
      paypal: "PayPal",
      wise: "Wise",
      payoneer: "Payoneer",
      bank: "Bank transfer",
      paypalEmail: "PayPal email",
      wiseId: "Wise email or account",
      payoneerId: "Payoneer email or account",
      bankName: "Bank name",
      accountName: "Account name",
      accountNo: "Account number",
      swift: "SWIFT / BIC",
      bankAddr: "Bank address",
      payExtra: "Other payment notes",
      proTitle: "Pro features",
      proHint: "A valid license removes the watermark and unlocks batch export. Paste the Gumroad license key from your receipt, or a signed code that starts with TP1_. Modern and Minimal templates can be previewed anytime; exports stay watermarked until a license is activated. The purchase button goes to Gumroad. 面包多 is coming soon. A Twinform TF1_ code will not unlock this tool.",
      licenseLabel: "License",
      licensePlaceholder: "Paste a Gumroad license key, or a signed code that starts with TP1_ (spaces and line breaks are ignored)",
      licenseActivate: "Activate",
      licenseActivated: "A license is active in this browser. The watermark is off and batch export is unlocked.",
      licenseClear: "Remove license from this browser",
      licenseInvalid: "That is not a valid Twinpack license. Paste the full TP1_ code — a Twinform TF1_ code will not work here.",
      licenseEmpty: "Paste a license first.",
      licenseBusy: "Checking…",
      licenseNetwork: "Could not reach the license server. Check your connection and try again.",
      licenseRevoked: "This license has been refunded or disputed and cannot be activated.",
      licenseSoon: "Store license keys could not be checked right now. A signed Twinpack TP1_ code can still be activated here.",
      buyCta: "Buy Pro · $12",
      buyHelp: "How it works",
      template: "Template",
      locked: "Preview",
      batch: "Batch export",
      batchHint: "Pick saved drafts and download the current document type as PDFs. Locked until a license is activated.",
      overflow: "Content may overflow one page. Shorten the document before exporting.",
      fit: "Preview is scaled to the window; the export stays A4.",
      saved: "Saved locally in this browser",
      draftName: "Draft name",
      load: "Open",
      del: "Delete",
      close: "Close",
      noDrafts: "No saved drafts yet.",
      watermark: "Twinpack Free",
      importJson: "Import JSON",
      exportJson: "Export JSON",
      importTwinform: "Import from Twinform",
      noTwinform: "No Twinform draft was found on this site origin. If the two tools are on different domains, export JSON from Twinform or use a file below.",
      importTitle: "Import",
      importHint: "You can read Twinform drafts saved on the same site origin (for example both on github.io), or import a Twinpack / Twinform JSON file. Fill in packing fields after import.",
      pickFile: "Choose a JSON file",
      imported: "Imported. Please check packing, weights, and Incoterms.",
      jsonError: "Could not read that JSON file.",
      paymentTitle: "Payment / 付款方式",
      notesTitle: "Notes / 备注",
    },
  };
  const uid = () =>
    crypto.randomUUID ? crypto.randomUUID() : "id-" + Math.random().toString(36).slice(2, 10);

  const todayISO = () => new Date().toISOString().slice(0, 10);

  function emptyItem() {
    return {
      id: uid(),
      desc: "",
      descEn: "",
      hsCode: "",
      qty: 1,
      unit: "PCS",
      unitPrice: 0,
      cartons: 1,
      cartonFrom: "",
      netWeight: 0,
      grossWeight: 0,
      length: 0,
      width: 0,
      height: 0,
    };
  }

  function defaultPayment() {
    return {
      paypal: false,
      wise: false,
      payoneer: false,
      bank: false,
      paypalEmail: "",
      wiseId: "",
      payoneerId: "",
      bankName: "",
      accountName: "",
      accountNo: "",
      swift: "",
      bankAddr: "",
      extra: "",
    };
  }

  function defaultShipment() {
    return {
      incoterms: "FOB",
      incotermsPlace: "",
      incotermsYear: "2020",
      transport: "sea",
      originCountry: "",
      departure: "",
      destination: "",
      vessel: "",
      marks: "",
      payTerms: "",
    };
  }

  function defaultState() {
    const y = new Date().getFullYear();
    return {
      docType: "invoice",
      langMode: "both",
      currency: "USD",
      template: "classic",
      invoiceNo: "CI-" + y + "-001",
      packingNo: "PL-" + y + "-001",
      packingNoManual: false,
      invoiceNoManual: false,
      issueDate: todayISO(),
      seller: {
        name: "",
        nameEn: "",
        address: "",
        addressEn: "",
        email: "",
        phone: "",
        website: "",
        taxId: "",
        logo: "",
      },
      client: { name: "", nameEn: "", address: "", addressEn: "", email: "", phone: "" },
      shipment: defaultShipment(),
      items: [emptyItem()],
      payment: defaultPayment(),
      notes: "",
    };
  }

  function exampleState() {
    const s = defaultState();
    s.invoiceNo = "CI-2026-018";
    s.packingNo = "PL-2026-018";
    s.issueDate = "2026-11-15";
    s.seller = {
      name: "北林工作室",
      nameEn: "Northwood Studio",
      address: "四川省成都市示例路 88 号（虚构地址）",
      addressEn: "88 Example Road, Chengdu, Sichuan, China (fictional)",
      email: "hello@northwood.example",
      phone: "+86 138 0000 0000",
      website: "https://northwood.example",
      taxId: "",
      logo: "assets/sample-logo.png",
    };
    s.client = {
      name: "Harbor & Co.",
      nameEn: "Harbor & Co.",
      address: "",
      addressEn: "120 Market Street, Suite 4, Seattle, WA, USA (fictional)",
      email: "projects@harbor.example",
      phone: "",
    };
    s.shipment = {
      incoterms: "FOB",
      incotermsPlace: "Ningbo",
      incotermsYear: "2020",
      transport: "sea",
      originCountry: "China",
      departure: "Ningbo, China",
      destination: "Seattle, USA",
      vessel: "",
      marks: "HARBOR / SEATTLE / C/NO. 1-70 / MADE IN CHINA\n(fictional example / 虚构示例)",
      payTerms: "40% deposit; balance before shipment. 定金 40%，余款发货前付清。（示例）",
    };
    s.items = [
      {
        id: uid(),
        desc: "陶瓷马克杯（白釉，330 ml）",
        descEn: "Ceramic mug, white glaze, 330 ml",
        hsCode: "6912.00",
        qty: 2400,
        unit: "PCS",
        unitPrice: 1.85,
        cartons: 50,
        cartonFrom: "",
        netWeight: 800,
        grossWeight: 900,
        length: 50,
        width: 40,
        height: 35,
      },
      {
        id: uid(),
        desc: "棉质短袖 T 恤（混码）",
        descEn: "Cotton short-sleeve T-shirt, assorted sizes",
        hsCode: "6109.10",
        qty: 800,
        unit: "PCS",
        unitPrice: 3.5,
        cartons: 20,
        cartonFrom: "",
        netWeight: 240,
        grossWeight: 280,
        length: 60,
        width: 40,
        height: 40,
      },
    ];
    s.payment = {
      paypal: true,
      wise: false,
      payoneer: false,
      bank: true,
      paypalEmail: "payments@northwood.example (example)",
      wiseId: "",
      payoneerId: "",
      bankName: "Example Bank (fictional)",
      accountName: "Northwood Studio",
      accountNo: "0000 0000 0000",
      swift: "EXAMPLED",
      bankAddr: "Chengdu, China",
      extra: "Use CI-2026-018 as the payment reference. 请在汇款备注中填写本发票号。（虚构示例）",
    };
    s.notes =
      "货物与数量为虚构示例，仅用于演示版式。\nFigures in this example are fictional and for layout only.";
    return s;
  }

  let uiLang = "zh";
  try {
    uiLang = localStorage.getItem(STORAGE_UI) || "zh";
  } catch (_) {}
  let licensed = false;
  let licenseNotice = "";
  let importNotice = "";
  let state = loadCurrent() || defaultState();
  let modal = null;
  let overflow = false;

  function isPro() {
    return licensed === true;
  }

  function t(key) {
    return (I18N[uiLang] || I18N.zh)[key] || key;
  }

  function num(n) {
    const v = Number(n);
    return Number.isFinite(v) ? v : 0;
  }

  function money(n) {
    const cfg = CURRENCIES[state.currency] || CURRENCIES.USD;
    const formatted = num(n).toLocaleString("en-US", {
      minimumFractionDigits: cfg.digits,
      maximumFractionDigits: cfg.digits,
    });
    return cfg.symbol + formatted;
  }

  function fmtNum(n, digits) {
    return num(n).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    });
  }

  function lineAmount(item) {
    return num(item.qty) * num(item.unitPrice);
  }

  function lineCbm(item) {
    return (num(item.length) * num(item.width) * num(item.height) * num(item.cartons)) / 1000000;
  }

  function cartonRanges(items) {
    let cursor = 1;
    return (items || []).map((it) => {
      const n = Math.max(0, Math.round(num(it.cartons)));
      if (String(it.cartonFrom || "").trim() !== "") {
        const from = Math.max(1, Math.round(num(it.cartonFrom)));
        const to = n > 0 ? from + n - 1 : from;
        cursor = to + 1;
        return { from, to, cartons: n };
      }
      if (n <= 0) return { from: "", to: "", cartons: 0 };
      const from = cursor;
      const to = cursor + n - 1;
      cursor = to + 1;
      return { from, to, cartons: n };
    });
  }

  function totals(src) {
    const s = src || state;
    const items = s.items || [];
    const qty = items.reduce((a, it) => a + num(it.qty), 0);
    const cartons = items.reduce((a, it) => a + num(it.cartons), 0);
    const net = items.reduce((a, it) => a + num(it.netWeight), 0);
    const gross = items.reduce((a, it) => a + num(it.grossWeight), 0);
    const cbm = items.reduce((a, it) => a + lineCbm(it), 0);
    const amount = items.reduce((a, it) => a + lineAmount(it), 0);
    return {
      qty,
      cartons,
      net: Math.round(net * 1000) / 1000,
      gross: Math.round(gross * 1000) / 1000,
      cbm: Math.round(cbm * 1000) / 1000,
      amount: Math.round(amount * 100000) / 100000,
    };
  }

  function loadCurrent() {
    try {
      const raw = localStorage.getItem(STORAGE_CURRENT);
      if (!raw) return null;
      return migrate(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  function migrate(s) {
    const d = defaultState();
    if (!s || typeof s !== "object") return d;
    return {
      ...d,
      ...s,
      seller: { ...d.seller, ...(s.seller || {}) },
      client: { ...d.client, ...(s.client || {}) },
      payment: { ...d.payment, ...(s.payment || {}) },
      shipment: { ...d.shipment, ...(s.shipment || {}) },
      items: Array.isArray(s.items) && s.items.length ? s.items.map((it) => ({ ...emptyItem(), ...it, id: it.id || uid() })) : d.items,
    };
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_CURRENT, JSON.stringify(state));
    } catch (err) {
      console.warn("Twinpack could not save to localStorage", err);
    }
  }

  let saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 300);
  }

  function listDrafts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_DRAFTS) || "[]");
    } catch {
      return [];
    }
  }

  function writeDrafts(list) {
    localStorage.setItem(STORAGE_DRAFTS, JSON.stringify(list));
  }

  function langText(zh, en) {
    if (state.langMode === "zh") return zh || en || "";
    if (state.langMode === "en") return en || zh || "";
    if (zh && en && zh !== en) return { zh, en };
    return zh || en || "";
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nl(str) {
    return escapeHtml(str).replace(/\n/g, "<br>");
  }

  function renderLabel(zh, en) {
    const v = langText(zh, en);
    if (v && typeof v === "object") {
      return `${escapeHtml(v.zh)} <span class="item-en">${escapeHtml(v.en)}</span>`;
    }
    return escapeHtml(v);
  }

  function docTitle() {
    if (state.docType === "packing") return langText("装箱单", "Packing List");
    return langText("商业发票", "Commercial Invoice");
  }

  function titleHtml() {
    const v = docTitle();
    if (v && typeof v === "object") {
      return `${escapeHtml(v.zh)}<span class="item-en">${escapeHtml(v.en)}</span>`;
    }
    return escapeHtml(v);
  }

  function incotermsLine() {
    const sh = state.shipment || {};
    const code = sh.incoterms === "OTHER" ? "" : sh.incoterms || "";
    const place = sh.incotermsPlace || "";
    const year = sh.incotermsYear ? `Incoterms ${sh.incotermsYear}` : "";
    return [code, place, year].filter(Boolean).join(" ");
  }

  function transportLabel() {
    const id = (state.shipment && state.shipment.transport) || "sea";
    const row = TRANSPORTS.find((x) => x.id === id) || TRANSPORTS[0];
    const v = langText(row.zh, row.en);
    return typeof v === "object" ? `${v.zh} / ${v.en}` : v;
  }

  function siteFooter() {
    const twin = "https://xiaoyangge1993.github.io/twinform/";
    if (uiLang === "en") {
      return `<footer class="site-footer">
        <div>Need a quotation or pro forma invoice first? Try <a href="${twin}">Twinform</a>.</div>
        <div class="foot-note">Twinpack is not a customs form, not a tax invoice, and not legal or tax advice.</div>
      </footer>`;
    }
    return `<footer class="site-footer">
      <div>需要先做报价单或形式发票？试试 <a href="${twin}">Twinform</a>。</div>
      <div class="foot-note">Twinpack 不是报关单或税务文件，也不构成法律或税务建议。</div>
    </footer>`;
  }
  function render() {
    const app = document.getElementById("app");
    const tot = totals();
    const pro = isPro();
    const effectiveTemplate = state.template || "classic";
    app.innerHTML = `
      <div class="app-shell">
      <header class="app-header">
        <a class="brand" href="./">
          <img src="assets/logo.svg" alt="Twinpack" />
          <span class="brand-name">Twinpack<small>${escapeHtml(t("tagline"))}</small></span>
        </a>
        <div class="header-group">
          <div class="seg" data-field="docType">
            <button type="button" data-value="invoice" aria-pressed="${state.docType === "invoice"}">${t("invoice")}</button>
            <button type="button" data-value="packing" aria-pressed="${state.docType === "packing"}">${t("packing")}</button>
          </div>
          <div class="seg" data-field="langMode">
            <button type="button" data-value="zh" aria-pressed="${state.langMode === "zh"}">${t("langZh")}</button>
            <button type="button" data-value="en" aria-pressed="${state.langMode === "en"}">${t("langEn")}</button>
            <button type="button" data-value="both" aria-pressed="${state.langMode === "both"}">${t("langBoth")}</button>
          </div>
          <label class="field-inline">${t("currency")}
            <select data-bind="currency">${Object.keys(CURRENCIES)
              .map((c) => `<option value="${c}" ${state.currency === c ? "selected" : ""}>${c}</option>`)
              .join("")}</select>
          </label>
          <span class="pill ${pro ? "pro" : "free"}">${pro ? "Pro" : "Free"}</span>
        </div>
        <div class="header-actions">
          <div class="seg" data-ui-lang>
            <button type="button" data-ui="zh" aria-pressed="${uiLang === "zh"}">界面中文</button>
            <button type="button" data-ui="en" aria-pressed="${uiLang === "en"}">UI English</button>
          </div>
          <button class="btn" data-action="example">${t("example")}</button>
          <button class="btn" data-action="import">${t("importTwinform")}</button>
          <button class="btn" data-action="export-json">${t("exportJson")}</button>
          <button class="btn" data-action="drafts">${t("drafts")}</button>
          <button class="btn" data-action="print">${t("print")}</button>
          <button class="btn" data-action="pdf">${t("exportPdf")}</button>
          <button class="btn btn-primary" data-action="pdf-both">${t("exportBoth")}</button>
        </div>
      </header>
      <div class="layout">
        <aside class="editor">
          <div class="disclaimer-banner">
            <strong>${t("legal")}</strong>
            ${uiLang === "en" ? escapeHtml(DISCLAIMER_BANNER.en) : escapeHtml(DISCLAIMER_BANNER.zh)}
          </div>
          ${importNotice ? `<p class="license-status ok">${escapeHtml(importNotice)}</p>` : ""}
          ${renderForm(tot, pro, effectiveTemplate)}
        </aside>
        <main class="preview-pane">
          <div class="preview-toolbar">
            <span>${t("fit")}</span>
            <span class="overflow-warn" data-overflow style="display:none">${t("overflow")}</span>
          </div>
          <div class="preview-scale" id="previewScale">
            ${renderSheet(tot, pro, effectiveTemplate)}
          </div>
        </main>
      </div>
      ${siteFooter()}
      </div>
      ${modalHtml()}
    `;
    bind();
    scalePreview();
    checkOverflow();
    document.documentElement.lang = uiLang === "en" ? "en" : "zh-CN";
  }

  function field(label, bindPath, opts = {}) {
    const { type = "text", placeholder = "", span = "" } = opts;
    const [root, key] = splitBind(bindPath);
    const val = key ? (root === "state" ? state[key] : state[root][key]) : "";
    if (type === "textarea") {
      return `<label class="lbl ${span}"><span>${label}</span><textarea data-bind="${bindPath}" placeholder="${escapeHtml(
        placeholder
      )}">${escapeHtml(val)}</textarea></label>`;
    }
    if (type === "select") {
      return `<label class="lbl ${span}"><span>${label}</span><select data-bind="${bindPath}">${opts.options || ""}</select></label>`;
    }
    return `<label class="lbl ${span}"><span>${label}</span><input type="${type}" data-bind="${bindPath}" value="${escapeHtml(
      val
    )}" placeholder="${escapeHtml(placeholder)}"></label>`;
  }

  function splitBind(bindPath) {
    const i = bindPath.indexOf(".");
    if (i < 0) return ["state", bindPath];
    return [bindPath.slice(0, i), bindPath.slice(i + 1)];
  }

  function totalsLine(tot) {
    return `${uiLang === "en" ? "Totals" : "汇总"}:
          <strong>${fmtNum(tot.qty, 0)}</strong> ${uiLang === "en" ? "qty" : "数量"} ·
          <strong>${fmtNum(tot.cartons, 0)}</strong> ${uiLang === "en" ? "cartons" : "件/箱"} ·
          N.W. <strong>${fmtNum(tot.net, 3)}</strong> kg ·
          G.W. <strong>${fmtNum(tot.gross, 3)}</strong> kg ·
          <strong>${fmtNum(tot.cbm, 3)}</strong> CBM ·
          ${state.currency} <strong>${money(tot.amount)}</strong>`;
  }

  function renderForm(tot, pro, effectiveTemplate) {
    const p = state.payment;
    const sh = state.shipment;
    const incOpts = INCOTERMS.map((c) => `<option value="${c}" ${sh.incoterms === c ? "selected" : ""}>${c}</option>`).join("");
    const trOpts = TRANSPORTS.map(
      (c) => `<option value="${c.id}" ${sh.transport === c.id ? "selected" : ""}>${uiLang === "en" ? c.en : c.zh}</option>`
    ).join("");
    const itemsHtml = state.items
      .map((it, i) => {
        const cbm = lineCbm(it);
        return `<div class="item-card">
          <div class="item-card-head">
            <span class="idx">#${i + 1}</span>
            <button class="icon-btn" type="button" data-action="del-item" data-i="${i}" aria-label="delete">×</button>
          </div>
          <div class="grid-2">
            <label class="lbl"><span>${t("desc")}</span><input data-item="${i}" data-k="desc" value="${escapeHtml(it.desc)}"></label>
            <label class="lbl"><span>${t("descEn")}</span><input data-item="${i}" data-k="descEn" value="${escapeHtml(it.descEn)}"></label>
            <label class="lbl full"><span>${t("hs")}</span><input data-item="${i}" data-k="hsCode" value="${escapeHtml(it.hsCode || "")}" placeholder="e.g. 6912.00"></label>
          </div>
          <div class="grid-4" style="margin-top:8px">
            <label class="lbl"><span>${t("qty")}</span><input type="number" data-item="${i}" data-k="qty" value="${escapeHtml(it.qty)}"></label>
            <label class="lbl"><span>${t("unit")}</span><input data-item="${i}" data-k="unit" value="${escapeHtml(it.unit)}"></label>
            <label class="lbl"><span>${t("unitPrice")}</span><input type="number" step="0.01" data-item="${i}" data-k="unitPrice" value="${escapeHtml(it.unitPrice)}"></label>
            <label class="lbl"><span>${t("cartons")}</span><input type="number" data-item="${i}" data-k="cartons" value="${escapeHtml(it.cartons)}"></label>
            <label class="lbl"><span>${t("netWeight")}</span><input type="number" step="0.001" data-item="${i}" data-k="netWeight" value="${escapeHtml(it.netWeight)}"></label>
            <label class="lbl"><span>${t("grossWeight")}</span><input type="number" step="0.001" data-item="${i}" data-k="grossWeight" value="${escapeHtml(it.grossWeight)}"></label>
            <label class="lbl"><span>${t("cartonFrom")}</span><input data-item="${i}" data-k="cartonFrom" value="${escapeHtml(it.cartonFrom || "")}"></label>
            <label class="lbl"><span>${t("amount")}</span><input value="${money(lineAmount(it))}" disabled></label>
          </div>
          <div class="grid-4" style="margin-top:8px">
            <label class="lbl"><span>${t("length")}</span><input type="number" step="0.1" data-item="${i}" data-k="length" value="${escapeHtml(it.length)}"></label>
            <label class="lbl"><span>${t("width")}</span><input type="number" step="0.1" data-item="${i}" data-k="width" value="${escapeHtml(it.width)}"></label>
            <label class="lbl"><span>${t("height")}</span><input type="number" step="0.1" data-item="${i}" data-k="height" value="${escapeHtml(it.height)}"></label>
            <label class="lbl"><span>CBM</span><input value="${fmtNum(cbm, 3)}" disabled></label>
          </div>
        </div>`;
      })
      .join("");

    return `
      <div class="section">
        <h2>${t("seller")}</h2>
        <div class="logo-row">
          ${
            state.seller.logo
              ? `<img src="${escapeHtml(state.seller.logo)}" alt="Logo">`
              : `<div class="logo-placeholder">${t("logo")}</div>`
          }
          <div>
            <button class="btn" data-action="upload-logo">${t("uploadLogo")}</button>
            ${state.seller.logo ? `<button class="btn btn-ghost" data-action="remove-logo">${t("removeLogo")}</button>` : ""}
            <p class="hint">PNG / JPG / SVG，将压缩后保存在本机。</p>
            <input type="file" accept="image/*" data-logo-file hidden>
          </div>
        </div>
        <div class="grid-2" style="margin-top:8px">
          ${field(t("name"), "seller.name")}
          ${field(t("nameEn"), "seller.nameEn")}
          ${field(t("address"), "seller.address", { type: "textarea", span: "full" })}
          ${field(t("addressEn"), "seller.addressEn", { type: "textarea", span: "full" })}
          ${field(t("email"), "seller.email", { type: "email" })}
          ${field(t("phone"), "seller.phone")}
          ${field(t("website"), "seller.website")}
          ${field(t("taxId"), "seller.taxId")}
        </div>
      </div>
      <div class="section">
        <h2>${t("client")}</h2>
        <div class="grid-2">
          ${field(t("name"), "client.name")}
          ${field(t("nameEn"), "client.nameEn")}
          ${field(t("address"), "client.address", { type: "textarea", span: "full" })}
          ${field(t("addressEn"), "client.addressEn", { type: "textarea", span: "full" })}
          ${field(t("email"), "client.email", { type: "email" })}
          ${field(t("phone"), "client.phone")}
        </div>
      </div>
      <div class="section">
        <h2>${state.docType === "packing" ? t("packing") : t("invoice")}</h2>
        <div class="grid-3">
          ${field(t("invoiceNo"), "invoiceNo")}
          ${field(t("packingNo"), "packingNo")}
          ${field(t("issueDate"), "issueDate", { type: "date" })}
        </div>
      </div>
      <div class="section">
        <h2>${t("shipment")}</h2>
        <div class="grid-3">
          ${field(t("incoterms"), "shipment.incoterms", { type: "select", options: incOpts })}
          ${field(t("incotermsPlace"), "shipment.incotermsPlace")}
          ${field(t("incotermsYear"), "shipment.incotermsYear")}
        </div>
        <div class="grid-2" style="margin-top:8px">
          ${field(t("transport"), "shipment.transport", { type: "select", options: trOpts })}
          ${field(t("origin"), "shipment.originCountry")}
          ${field(t("departure"), "shipment.departure")}
          ${field(t("destination"), "shipment.destination")}
          ${field(t("vessel"), "shipment.vessel", { span: "full" })}
          ${field(t("marks"), "shipment.marks", { type: "textarea", span: "full" })}
          ${field(t("payTerms"), "shipment.payTerms", { type: "textarea", span: "full" })}
        </div>
        <p class="hint">${uiLang === "en" ? "Write Incoterms with a named place, e.g. FOB Ningbo Incoterms 2020. This tool does not validate trade terms." : "贸易术语请写上具体地点，例如 FOB Ningbo Incoterms 2020。本工具不做条款校验。"}</p>
      </div>
      <div class="section">
        <h2>${t("items")} <button class="btn" type="button" data-action="add-item">${t("addItem")}</button></h2>
        ${itemsHtml}
        <p class="item-totals" data-totals>${totalsLine(tot)}</p>
        <p class="hint">${uiLang === "en" ? "Net and gross weights are line totals in kilograms. CBM = L × W × H (cm) × cartons ÷ 1,000,000. HS codes are printed as typed — this tool does not classify them." : "净重和毛重按行填写合计千克。体积 CBM = 长×宽×高（厘米）×箱数÷1,000,000。HS 编码按你输入的原样打印，本工具不做归类。"}</p>
      </div>
      <div class="section">
        <h2>${t("payment")}</h2>
        <div class="pay-block">
          <label class="check"><input type="checkbox" data-bind="payment.paypal" ${p.paypal ? "checked" : ""}> ${t("paypal")}</label>
          ${p.paypal ? field(t("paypalEmail"), "payment.paypalEmail") : ""}
          <label class="check"><input type="checkbox" data-bind="payment.wise" ${p.wise ? "checked" : ""}> ${t("wise")}</label>
          ${p.wise ? field(t("wiseId"), "payment.wiseId") : ""}
          <label class="check"><input type="checkbox" data-bind="payment.payoneer" ${p.payoneer ? "checked" : ""}> ${t("payoneer")}</label>
          ${p.payoneer ? field(t("payoneerId"), "payment.payoneerId") : ""}
          <label class="check"><input type="checkbox" data-bind="payment.bank" ${p.bank ? "checked" : ""}> ${t("bank")}</label>
          ${
            p.bank
              ? `<div class="grid-2">${field(t("bankName"), "payment.bankName")}${field(t("accountName"), "payment.accountName")}${field(t("accountNo"), "payment.accountNo")}${field(t("swift"), "payment.swift")}${field(t("bankAddr"), "payment.bankAddr", { span: "full" })}</div>`
              : ""
          }
          ${field(t("payExtra"), "payment.extra", { type: "textarea", span: "full" })}
        </div>
      </div>
      <div class="section">
        <h2>${t("notes")}</h2>
        ${field(t("notes"), "notes", { type: "textarea", span: "full" })}
      </div>
      <div class="section pro-box">
        <h3>${t("proTitle")}</h3>
        <p class="hint">${t("proHint")}</p>
        <div class="license-box">
          <label class="license-label" for="license-input">${t("licenseLabel")}</label>
          ${
            pro
              ? `<p class="license-status ok">${t("licenseActivated")}</p>
                 <button class="btn" type="button" data-action="clear-license">${t("licenseClear")}</button>`
              : `<textarea id="license-input" class="license-input" data-license-input rows="3" spellcheck="false" placeholder="${escapeHtml(t("licensePlaceholder"))}"></textarea>
                 <div class="license-actions">
                   <button class="btn btn-primary" type="button" data-action="activate-license">${t("licenseActivate")}</button>
                 </div>
                 ${licenseNotice === "invalid" ? `<p class="license-status err">${t("licenseInvalid")}</p>` : ""}
                 ${licenseNotice === "revoked" ? `<p class="license-status err">${t("licenseRevoked")}</p>` : ""}
                 ${licenseNotice === "network" ? `<p class="license-status err">${t("licenseNetwork")}</p>` : ""}
                 ${licenseNotice === "unavailable" ? `<p class="license-status err">${t("licenseSoon")}</p>` : ""}
                 ${licenseNotice === "product" ? `<p class="license-status err">${t("licenseInvalid")}</p>` : ""}
                 ${licenseNotice === "empty" ? `<p class="license-status err">${t("licenseEmpty")}</p>` : ""}
                 ${licenseNotice === "busy" ? `<p class="license-status">${t("licenseBusy")}</p>` : ""}`
          }
        </div>
        <div style="margin:10px 0 8px">
          <span class="lock">${t("template")}</span>
          <div class="seg" data-field="template" style="margin-left:8px">
            ${TEMPLATES.map((tpl) => {
              const tag = tpl.pro && !pro ? " · " + t("locked") : "";
              return `<button type="button" data-value="${tpl.id}" aria-pressed="${effectiveTemplate === tpl.id}">${uiLang === "en" ? tpl.en : tpl.zh}${tag}</button>`;
            }).join("")}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn" data-action="batch" ${pro ? "" : "disabled"}>${t("batch")}</button>
          <a class="btn-pro" href="${escapeHtml((window.TwinpackLicense && TwinpackLicense.GUMROAD_URL) || "https://xiaoxiaoyang.gumroad.com/l/cjxupc")}" target="_blank" rel="noopener noreferrer">${t("buyCta")}</a>
          <a class="btn btn-ghost" href="purchase.html">${t("buyHelp")}</a>
        </div>
        <p class="hint">${t("batchHint")}</p>
      </div>
      <p class="muted">${t("saved")}</p>
    `;
  }
  function partyHtml(person, modeFrom) {
    const name = langText(person.name, person.nameEn);
    const addr = langText(person.address, person.addressEn);
    let nameHtml = "";
    if (name && typeof name === "object") {
      nameHtml = `<div class="name">${escapeHtml(name.zh)}</div><div class="en">${escapeHtml(name.en)}</div>`;
    } else {
      nameHtml = `<div class="name">${escapeHtml(name)}</div>`;
    }
    let addrHtml = "";
    if (addr && typeof addr === "object") {
      addrHtml = `<div class="addr">${nl(addr.zh)}<br>${nl(addr.en)}</div>`;
    } else if (addr) {
      addrHtml = `<div class="addr">${nl(addr)}</div>`;
    }
    const bits = [person.email, person.phone, person.website, person.taxId].filter(Boolean);
    return `
      <div class="party">
        <div class="k">${modeFrom === "billFrom" ? labelPlain("卖方", "From") : labelPlain("买方 / 收货人", "To")}</div>
        ${nameHtml}
        ${addrHtml}
        ${bits.length ? `<div class="addr">${bits.map(escapeHtml).join("<br>")}</div>` : ""}
      </div>`;
  }

  function paymentHtml() {
    const p = state.payment;
    const lines = [];
    if (state.shipment && state.shipment.payTerms) lines.push(state.shipment.payTerms);
    if (p.paypal && p.paypalEmail) lines.push("PayPal: " + p.paypalEmail);
    if (p.wise && p.wiseId) lines.push("Wise: " + p.wiseId);
    if (p.payoneer && p.payoneerId) lines.push("Payoneer: " + p.payoneerId);
    if (p.bank) {
      const bankLines = [
        p.bankName && `${labelPlainRaw("银行", "Bank")}: ${p.bankName}`,
        p.accountName && `${labelPlainRaw("账户名", "Account name")}: ${p.accountName}`,
        p.accountNo && `${labelPlainRaw("账号", "Account no.")}: ${p.accountNo}`,
        p.swift && "SWIFT / BIC: " + p.swift,
        p.bankAddr,
      ].filter(Boolean);
      if (bankLines.length) lines.push(bankLines.join("\n"));
    }
    if (p.extra) lines.push(p.extra);
    if (!lines.length) return "";
    return `<div><h3>${t("paymentTitle")}</h3><p>${nl(lines.join("\n\n"))}</p></div>`;
  }

  function shipmentBlock() {
    const sh = state.shipment || {};
    const rows = [
      [labelPlainRaw("贸易术语", "Incoterms"), incotermsLine() || "—"],
      [labelPlainRaw("运输方式", "Transport"), transportLabel()],
      [labelPlainRaw("原产国", "Origin"), sh.originCountry || "—"],
      [labelPlainRaw("起运地", "Loading"), sh.departure || "—"],
      [labelPlainRaw("目的地", "Destination"), sh.destination || "—"],
    ];
    if (sh.vessel) rows.push([labelPlainRaw("船名 / 运单", "Vessel / tracking"), sh.vessel]);
    return `<div class="ship-grid">${rows
      .map(([k, v]) => `<div><div class="k">${escapeHtml(k)}</div><div>${nl(v)}</div></div>`)
      .join("")}</div>
      ${sh.marks ? `<div class="notes" style="margin:0 0 5mm"><h3>${labelPlain("唛头", "Shipping marks")}</h3><p>${nl(sh.marks)}</p></div>` : ""}`;
  }

  function sumBar(tot) {
    return `<div class="sum-bar">
      <div><div class="k">${labelPlain("总数量", "Total qty")}</div><div class="v">${fmtNum(tot.qty, 0)}</div></div>
      <div><div class="k">${labelPlain("总件数", "Packages")}</div><div class="v">${fmtNum(tot.cartons, 0)}</div></div>
      <div><div class="k">${labelPlain("净重 / 毛重", "N.W. / G.W.")}</div><div class="v">${fmtNum(tot.net, 3)} / ${fmtNum(tot.gross, 3)} kg</div></div>
      <div><div class="k">${labelPlain("总体积", "Volume")}</div><div class="v">${fmtNum(tot.cbm, 3)} CBM</div></div>
    </div>`;
  }

  function renderSheet(tot, pro, effectiveTemplate) {
    const isPack = state.docType === "packing";
    const watermark = pro
      ? ""
      : `<div class="sheet-wm"><div class="wm-diag">${t("watermark")}</div><div class="wm-foot">${t("watermark")}</div></div>`;
    const logo = state.seller.logo ? `<img class="sheet-logo" src="${escapeHtml(state.seller.logo)}" alt="">` : "";
    const docNo = isPack ? state.packingNo : state.invoiceNo;
    const metaBits = [
      metaLine(isPack ? "装箱单号" : "发票号", "No.", docNo || "—"),
      metaLine(isPack ? "对应发票" : "装箱单号", isPack ? "Invoice no." : "Packing list", isPack ? state.invoiceNo || "—" : state.packingNo || "—"),
      metaLine("日期", "Date", state.issueDate || "—"),
    ];
    if (!isPack) metaBits.push(metaLine("币种", "Currency", state.currency));

    const headInner = `
        ${logo}
        <div class="sheet-title">
          <h1>${titleHtml()}</h1>
          <div class="sub">${escapeHtml(notOfficialLine())}</div>
          <div class="sheet-meta">${metaBits.map(escapeHtml).join("<br>")}</div>
        </div>`;

    const ranges = cartonRanges(state.items);
    const items = state.items
      .map((it, i) => {
        const desc = renderLabel(it.desc, it.descEn);
        const hs = it.hsCode ? `<span class="item-en">HS ${escapeHtml(it.hsCode)}</span>` : "";
        const unit = it.unit ? " " + escapeHtml(it.unit) : "";
        const r = ranges[i] || {};
        const cno = r.cartons ? r.from + "-" + r.to : "—";
        const dim =
          num(it.length) || num(it.width) || num(it.height)
            ? `${it.length || 0}×${it.width || 0}×${it.height || 0} cm`
            : "—";
        if (isPack) {
          return `<tr>
            <td>${desc}${hs}</td>
            <td class="num">${escapeHtml(it.qty)}${unit}</td>
            <td class="num">${fmtNum(it.cartons, 0)}</td>
            <td class="num">${escapeHtml(cno)}</td>
            <td class="num">${fmtNum(it.netWeight, 3)}</td>
            <td class="num">${fmtNum(it.grossWeight, 3)}</td>
            <td class="num">${escapeHtml(dim)}</td>
            <td class="num">${fmtNum(lineCbm(it), 3)}</td>
          </tr>`;
        }
        return `<tr>
          <td>${desc}${hs}</td>
          <td class="num">${escapeHtml(it.qty)}${unit}</td>
          <td class="num">${money(it.unitPrice)}</td>
          <td class="num">${fmtNum(it.cartons, 0)}</td>
          <td class="num">${money(lineAmount(it))}</td>
        </tr>`;
      })
      .join("");

    const headCols = isPack
      ? `<th>${labelPlain("描述", "Description")}</th>
         <th class="num">${labelPlain("数量", "Qty")}</th>
         <th class="num">${labelPlain("箱数", "CTNS")}</th>
         <th class="num">${labelPlain("箱号", "C/NO.")}</th>
         <th class="num">${labelPlain("净重 kg", "N.W. kg")}</th>
         <th class="num">${labelPlain("毛重 kg", "G.W. kg")}</th>
         <th class="num">${labelPlain("尺寸", "Dims")}</th>
         <th class="num">CBM</th>`
      : `<th>${labelPlain("描述", "Description")}</th>
         <th class="num">${labelPlain("数量", "Qty")}</th>
         <th class="num">${labelPlain("单价", "Unit price")}</th>
         <th class="num">${labelPlain("箱数", "CTNS")}</th>
         <th class="num">${labelPlain("金额", "Amount")}</th>`;

    const amountBlock = isPack
      ? ""
      : `<div class="totals">
          <div class="row grand"><span>${labelPlain("合计", "Total")}</span><span>${state.currency} ${money(tot.amount)}</span></div>
        </div>`;

    const notes = state.notes
      ? `<div class="notes"><h3>${t("notesTitle")}</h3><p>${nl(state.notes)}</p></div>`
      : "";

    const discBlock =
      state.langMode === "both"
        ? `<div class="sheet-disc">${escapeHtml(DISCLAIMER.zh)}<br><br>${escapeHtml(DISCLAIMER.en)}</div>`
        : `<div class="sheet-disc">${escapeHtml(state.langMode === "en" ? DISCLAIMER.en : DISCLAIMER.zh)}</div>`;

    const pay = isPack ? "" : `<div class="pay">${paymentHtml()}${notes}</div>`;
    const packNotes = isPack ? `<div class="pay">${notes}</div>` : "";

    const body = `
        <div class="parties">
          ${partyHtml(state.seller, "billFrom")}
          ${partyHtml(state.client, "billTo")}
        </div>
        ${shipmentBlock()}
        <table>
          <thead><tr>${headCols}</tr></thead>
          <tbody>${items}</tbody>
        </table>
        ${amountBlock}
        ${sumBar(tot)}
        ${pay}
        ${packNotes}
        ${discBlock}
    `;

    if (effectiveTemplate === "modern") {
      return `<article class="sheet tpl-modern" id="sheet">${watermark}
        <div class="modern-bar">${headInner}</div>
        <div class="sheet-body">${body}</div>
      </article>`;
    }
    return `<article class="sheet tpl-${escapeHtml(effectiveTemplate)}" id="sheet">${watermark}
      <div class="sheet-head">${headInner}</div>
      ${body}
    </article>`;
  }

  function labelPlain(zh, en) {
    if (state.langMode === "zh") return escapeHtml(zh);
    if (state.langMode === "en") return escapeHtml(en);
    return `${escapeHtml(zh)} / ${escapeHtml(en)}`;
  }

  function metaLine(zh, en, value) {
    return `${labelPlainRaw(zh, en)}: ${value}`;
  }

  function labelPlainRaw(zh, en) {
    if (state.langMode === "zh") return zh;
    if (state.langMode === "en") return en;
    return `${zh} / ${en}`;
  }

  function notOfficialLine() {
    if (state.langMode === "en") return "Not a customs form · Not a tax invoice";
    if (state.langMode === "zh") return "非报关单 · 非税务发票";
    return "非报关单 · Not a customs form · 非税务发票 · Not a tax invoice";
  }
  function listTwinformSources() {
    const out = [];
    try {
      const raw = localStorage.getItem(TWINFORM_CURRENT);
      if (raw) {
        const data = JSON.parse(raw);
        out.push({ id: "__current__", name: uiLang === "en" ? "Twinform current draft" : "Twinform 当前草稿", data, updatedAt: "" });
      }
    } catch (_) {}
    try {
      const drafts = JSON.parse(localStorage.getItem(TWINFORM_DRAFTS) || "[]");
      for (const d of drafts) {
        out.push({ id: d.id, name: "Twinform · " + (d.name || d.id), data: d.data, updatedAt: d.updatedAt || "" });
      }
    } catch (_) {}
    return out;
  }

  function fromTwinform(s) {
    const invoiceNo = String((s && s.number) || "").replace(/^(Q|PF)-/i, "CI-") || defaultState().invoiceNo;
    const packingNo = invoiceNo.replace(/^CI-/i, "PL-");
    return migrate({
      langMode: (s && s.langMode) || "both",
      currency: (s && s.currency) || "USD",
      invoiceNo,
      packingNo,
      packingNoManual: false,
      issueDate: (s && s.issueDate) || todayISO(),
      seller: s && s.seller,
      client: s && s.client,
      payment: s && s.payment,
      notes: (s && s.notes) || "",
      items: ((s && s.items) || []).map((it) => ({
        ...emptyItem(),
        desc: it.desc || "",
        descEn: it.descEn || "",
        qty: it.qty,
        unit: it.unit || "PCS",
        unitPrice: it.unitPrice,
      })),
    });
  }

  function looksLikeTwinform(obj) {
    if (!obj || typeof obj !== "object") return false;
    if (obj.app === "twinform" && obj.data) return true;
    if (obj.docType === "quote" || obj.docType === "proforma") return true;
    if (obj.number && obj.seller && obj.items && !obj.invoiceNo) return true;
    return false;
  }

  function parseImportPayload(obj) {
    if (!obj || typeof obj !== "object") throw new Error("invalid");
    if (obj.app === "twinpack" && obj.data) return migrate(obj.data);
    if (looksLikeTwinform(obj)) return fromTwinform(obj.data || obj);
    if (obj.invoiceNo || (obj.shipment && obj.items)) return migrate(obj.data || obj);
    throw new Error("unrecognized");
  }

  function modalHtml() {
    if (!modal) return "";
    if (modal === "drafts" || modal === "batch") {
      const drafts = listDrafts();
      const isBatch = modal === "batch";
      return `<div class="modal-back" data-close-modal>
        <div class="modal" role="dialog" aria-modal="true">
          <h2>${isBatch ? t("batch") : t("drafts")}</h2>
          ${isBatch ? `<p class="hint">${t("batchHint")}</p>` : ""}
          ${
            drafts.length === 0
              ? `<p class="muted">${t("noDrafts")}</p>`
              : `<ul class="draft-list">${drafts
                  .map(
                    (d) => `<li>
                    ${isBatch ? `<input type="checkbox" data-draft-check="${escapeHtml(d.id)}" checked>` : ""}
                    <span><strong>${escapeHtml(d.name)}</strong><div class="muted">${escapeHtml(d.updatedAt || "")}</div></span>
                    ${
                      isBatch
                        ? ""
                        : `<button class="btn" data-action="load-draft" data-id="${escapeHtml(d.id)}">${t("load")}</button>
                           <button class="btn btn-ghost" data-action="del-draft" data-id="${escapeHtml(d.id)}">${t("del")}</button>`
                    }
                  </li>`
                  )
                  .join("")}</ul>`
          }
          ${
            !isBatch
              ? `<div class="grid-2" style="margin-top:12px">${field(t("draftName"), "_draftName")}<div style="align-self:end"><button class="btn btn-primary" data-action="save-draft">${t("saveDraft")}</button></div></div>`
              : `<div style="margin-top:12px"><button class="btn btn-primary" data-action="run-batch">${t("exportPdf")}</button></div>`
          }
          <div style="margin-top:12px"><button class="btn" data-close-modal>${t("close")}</button></div>
        </div>
      </div>`;
    }
    if (modal === "import") {
      const sources = listTwinformSources();
      return `<div class="modal-back" data-close-modal>
        <div class="modal" role="dialog" aria-modal="true">
          <h2>${t("importTitle")}</h2>
          <p class="hint">${t("importHint")}</p>
          ${
            sources.length === 0
              ? `<p class="muted">${t("noTwinform")}</p>`
              : `<ul class="import-list">${sources
                  .map(
                    (d) => `<li>
                    <span><strong>${escapeHtml(d.name)}</strong><div class="muted">${escapeHtml(d.updatedAt || "")}</div></span>
                    <button class="btn" data-action="import-twinform" data-id="${escapeHtml(d.id)}">${t("load")}</button>
                  </li>`
                  )
                  .join("")}</ul>`
          }
          <div style="margin-top:14px">
            <button class="btn" data-action="pick-json">${t("pickFile")}</button>
            <input type="file" accept="application/json,.json" data-json-file hidden>
          </div>
          <div style="margin-top:12px"><button class="btn" data-close-modal>${t("close")}</button></div>
        </div>
      </div>`;
    }
    return "";
  }

  function getBindValue(el) {
    if (el.type === "checkbox") return el.checked;
    if (el.type === "number") return el.value === "" ? 0 : el.value;
    return el.value;
  }

  function setBind(path, value) {
    const [root, key] = splitBind(path);
    if (!key) return;
    if (root === "state") state[key] = value;
    else state[root][key] = value;
  }

  function syncPackingNo() {
    if (state.packingNoManual) return;
    const inv = String(state.invoiceNo || "");
    if (/^CI-/i.test(inv)) state.packingNo = inv.replace(/^CI-/i, "PL-");
  }

  function bind() {
    const app = document.getElementById("app");

    app.querySelectorAll("[data-field] button[data-value]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fieldName = btn.parentElement.getAttribute("data-field");
        const value = btn.getAttribute("data-value");
        state[fieldName] = value;
        persistAndRender();
      });
    });

    app.querySelectorAll("[data-ui-lang] button").forEach((btn) => {
      btn.addEventListener("click", () => {
        uiLang = btn.getAttribute("data-ui");
        try {
          localStorage.setItem(STORAGE_UI, uiLang);
        } catch (_) {}
        render();
      });
    });

    app.querySelectorAll("[data-bind]").forEach((el) => {
      const ev = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, () => {
        const path = el.getAttribute("data-bind");
        if (path === "_draftName") return;
        setBind(path, getBindValue(el));
        if (path === "invoiceNo") {
          state.invoiceNoManual = true;
          syncPackingNo();
        }
        if (path === "packingNo") state.packingNoManual = true;
        scheduleSave();
        if (path.startsWith("payment.") || path === "shipment.incoterms" || path === "shipment.transport") {
          render();
        } else {
          refreshPreviewOnly();
          const box = app.querySelector("[data-totals]");
          if (box) box.innerHTML = totalsLine(totals());
        }
      });
    });

    app.querySelectorAll("[data-item]").forEach((el) => {
      el.addEventListener("input", () => {
        const i = Number(el.getAttribute("data-item"));
        const k = el.getAttribute("data-k");
        state.items[i][k] = el.type === "number" && el.value === "" ? 0 : el.value;
        scheduleSave();
        refreshPreviewOnly();
        const box = app.querySelector("[data-totals]");
        if (box) box.innerHTML = totalsLine(totals());
      });
    });

    app.querySelectorAll("[data-action]").forEach((el) => {
      el.addEventListener("click", () => {
        const action = el.getAttribute("data-action");
        if (action === "add-item") {
          state.items.push(emptyItem());
          persistAndRender();
        } else if (action === "del-item") {
          const i = Number(el.getAttribute("data-i"));
          state.items.splice(i, 1);
          if (!state.items.length) state.items.push(emptyItem());
          persistAndRender();
        } else if (action === "example") {
          if (confirm(uiLang === "en" ? "Replace the current form with the fictional example?" : "用虚构示例替换当前内容？")) {
            state = exampleState();
            persistAndRender();
          }
        } else if (action === "drafts") {
          modal = "drafts";
          render();
        } else if (action === "import") {
          modal = "import";
          render();
        } else if (action === "export-json") {
          exportJson();
        } else if (action === "pick-json") {
          const f = app.querySelector("[data-json-file]");
          if (f) f.click();
        } else if (action === "import-twinform") {
          const id = el.getAttribute("data-id");
          const src = listTwinformSources().find((x) => x.id === id);
          if (src && src.data) {
            state = fromTwinform(src.data);
            modal = null;
            importNotice = t("imported");
            persistAndRender();
            setTimeout(() => {
              importNotice = "";
            }, 6000);
          }
        } else if (action === "batch") {
          if (!isPro()) return;
          modal = "batch";
          render();
        } else if (action === "print") {
          scalePreview(true);
          window.print();
          scalePreview();
        } else if (action === "pdf") {
          downloadPdf();
        } else if (action === "pdf-both") {
          downloadBoth();
        } else if (action === "upload-logo") {
          app.querySelector("[data-logo-file]").click();
        } else if (action === "remove-logo") {
          state.seller.logo = "";
          persistAndRender();
        } else if (action === "activate-license") {
          const input = app.querySelector("[data-license-input]");
          const code = input ? input.value : "";
          activateLicense(code).then(() => render());
        } else if (action === "clear-license") {
          clearLicense();
          persistAndRender();
        } else if (action === "save-draft") {
          const input = app.querySelector("[data-bind='_draftName']");
          const name = (input && input.value.trim()) || defaultDraftName();
          const drafts = listDrafts();
          drafts.unshift({ id: uid(), name, updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "), data: structuredClone(state) });
          writeDrafts(drafts.slice(0, 50));
          modal = "drafts";
          render();
        } else if (action === "load-draft") {
          const d = listDrafts().find((x) => x.id === el.getAttribute("data-id"));
          if (d) {
            state = migrate(d.data);
            modal = null;
            persistAndRender();
          }
        } else if (action === "del-draft") {
          writeDrafts(listDrafts().filter((x) => x.id !== el.getAttribute("data-id")));
          render();
        } else if (action === "run-batch") {
          const ids = [...app.querySelectorAll("[data-draft-check]:checked")].map((x) => x.getAttribute("data-draft-check"));
          runBatch(ids);
        }
      });
    });

    const file = app.querySelector("[data-logo-file]");
    if (file) {
      file.addEventListener("change", async () => {
        const f = file.files && file.files[0];
        if (!f) return;
        state.seller.logo = await resizeImage(f);
        persistAndRender();
      });
    }

    const jsonFile = app.querySelector("[data-json-file]");
    if (jsonFile) {
      jsonFile.addEventListener("change", async () => {
        const f = jsonFile.files && jsonFile.files[0];
        if (!f) return;
        try {
          const text = await f.text();
          state = parseImportPayload(JSON.parse(text));
          modal = null;
          importNotice = t("imported");
          persistAndRender();
          setTimeout(() => {
            importNotice = "";
          }, 6000);
        } catch (err) {
          importNotice = t("jsonError");
          render();
        }
      });
    }

    app.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target === el || (el.hasAttribute("data-close-modal") && el.tagName === "BUTTON")) {
          modal = null;
          render();
        }
      });
    });
  }
  function defaultDraftName() {
    const title = state.docType === "packing" ? "PL" : "CI";
    const no = state.docType === "packing" ? state.packingNo : state.invoiceNo;
    return `${title} ${no || ""} ${state.client.name || state.client.nameEn || ""}`.trim();
  }

  function persistAndRender() {
    persist();
    render();
  }

  function refreshPreviewOnly() {
    const tot = totals();
    const pro = isPro();
    const effectiveTemplate = state.template;
    const wrap = document.getElementById("previewScale");
    if (!wrap) return;
    wrap.innerHTML = renderSheet(tot, pro, effectiveTemplate);
    scalePreview();
    checkOverflow();
  }

  function scalePreview(reset) {
    const box = document.querySelector(".preview-pane");
    const scaleEl = document.getElementById("previewScale");
    const sheet = document.getElementById("sheet");
    if (!box || !scaleEl || !sheet) return;
    if (reset) {
      scaleEl.style.transform = "none";
      return;
    }
    const avail = box.clientWidth - 32;
    const width = sheet.offsetWidth;
    const s = Math.min(1, avail / width);
    scaleEl.style.transform = s < 0.999 ? `scale(${s})` : "none";
    scaleEl.style.height = s < 0.999 ? sheet.offsetHeight * s + "px" : "auto";
  }

  function checkOverflow() {
    const sheet = document.getElementById("sheet");
    const warn = document.querySelector("[data-overflow]");
    if (!sheet || !warn) return;
    const max = mmToPx(297) + 2;
    overflow = sheet.scrollHeight > max + 8;
    warn.style.display = overflow ? "inline" : "none";
  }

  function mmToPx(mm) {
    return (mm / 25.4) * 96;
  }

  async function resizeImage(file) {
    const url = await readFile(file);
    if (file.type === "image/svg+xml") return url;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const max = 640;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          const r = Math.min(max / w, max / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/png"));
      };
      img.src = url;
    });
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function fileBase(kind) {
    const k = kind || (state.docType === "packing" ? "PackingList" : "CommercialInvoice");
    const no = ((state.docType === "packing" ? state.packingNo : state.invoiceNo) || "draft").replace(/[^\w.-]+/g, "_");
    return `Twinpack-${k}-${no}`;
  }

  function exportJson() {
    const payload = {
      app: "twinpack",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileBase("Data") + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function waitFonts() {
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
    }
  }

  async function makePdf() {
    await waitFonts();
    const sheet = document.getElementById("sheet");
    if (!sheet || !window.html2canvas || !window.jspdf) {
      throw new Error("PDF library failed to load.");
    }
    const canvas = await html2canvas(sheet, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: sheet.offsetWidth,
      height: sheet.offsetHeight,
      windowWidth: sheet.offsetWidth,
      windowHeight: sheet.offsetHeight,
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = 210;
    const pageH = 297;
    const imgW = pageW;
    const imgH = (canvas.height / canvas.width) * pageW;
    const img = canvas.toDataURL("image/jpeg", 0.95);
    let remaining = imgH;
    let offset = 0;
    let page = 0;
    while (remaining > 0.5) {
      if (page > 0) pdf.addPage();
      pdf.addImage(img, "JPEG", 0, -offset, imgW, imgH);
      remaining -= pageH;
      offset += pageH;
      page += 1;
      if (page > 8) break;
    }
    return { pdf, pages: page, width: canvas.width, height: canvas.height };
  }

  async function downloadPdf(customName) {
    const { pdf } = await makePdf();
    const name = (customName || fileBase()) + ".pdf";
    pdf.save(name);
    return name;
  }

  async function downloadBoth() {
    const current = state.docType;
    state.docType = "invoice";
    refreshPreviewOnly();
    await new Promise((r) => setTimeout(r, 80));
    await downloadPdf(fileBase("CommercialInvoice"));
    state.docType = "packing";
    refreshPreviewOnly();
    await new Promise((r) => setTimeout(r, 80));
    await downloadPdf(fileBase("PackingList"));
    state.docType = current;
    refreshPreviewOnly();
  }

  async function runBatch(ids) {
    if (!isPro()) return;
    const drafts = listDrafts();
    const chosen = drafts.filter((d) => ids.includes(d.id));
    if (!chosen.length) return;
    const current = structuredClone(state);
    modal = null;
    for (const d of chosen) {
      state = migrate(d.data);
      render();
      await waitFonts();
      await new Promise((r) => setTimeout(r, 200));
      await downloadPdf("Twinpack-" + d.name.replace(/[^\w.-]+/g, "_"));
      await new Promise((r) => setTimeout(r, 400));
    }
    state = current;
    render();
  }

  window.addEventListener("resize", () => scalePreview());

  async function activateLicense(code, { allowOffline = false } = {}) {
    const trimmed = String(code || "").trim();
    if (!trimmed) {
      licenseNotice = "empty";
      return false;
    }
    if (!window.TwinpackLicense || typeof TwinpackLicense.verify !== "function") {
      licenseNotice = "invalid";
      return false;
    }
    licenseNotice = "busy";
    const result = await TwinpackLicense.verify(trimmed);
    if (result && result.ok) {
      licensed = true;
      licenseNotice = "ok";
      try {
        localStorage.setItem(STORAGE_LICENSE, result.normalized || TwinpackLicense.normalize(trimmed));
      } catch (_) {}
      return true;
    }
    if (allowOffline && result && result.reason === "network") {
      licensed = true;
      licenseNotice = "ok";
      return true;
    }
    licenseNotice =
      result && result.reason === "revoked"
        ? "revoked"
        : result && result.reason === "network"
          ? "network"
          : result && result.reason === "unavailable"
            ? "unavailable"
            : result && result.reason === "product"
              ? "product"
              : "invalid";
    return false;
  }

  function clearLicense() {
    licensed = false;
    licenseNotice = "";
    try {
      localStorage.removeItem(STORAGE_LICENSE);
    } catch (_) {}
  }

  function stripLicenseQuery() {
    const params = new URLSearchParams(location.search);
    if (!params.has("license")) return;
    params.delete("license");
    const qs = params.toString();
    const url = location.pathname + (qs ? "?" + qs : "") + location.hash;
    history.replaceState({}, "", url);
  }

  async function bootLicense() {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get("license");
    if (fromQuery != null && String(fromQuery).length) {
      const ok = await activateLicense(fromQuery);
      stripLicenseQuery();
      return ok;
    }
    let stored = "";
    try {
      stored = localStorage.getItem(STORAGE_LICENSE) || "";
    } catch (_) {}
    if (stored) {
      const ok = await activateLicense(stored, { allowOffline: true });
      if (!ok) clearLicense();
      return ok;
    }
    return false;
  }

  window.Twinpack = {
    loadExample() {
      state = exampleState();
      persistAndRender();
    },
    applyLicense(code) {
      return activateLicense(code).then((ok) => {
        render();
        return ok;
      });
    },
    clearLicense() {
      clearLicense();
      persistAndRender();
    },
    setTemplate(id) {
      if (!TEMPLATES.some((x) => x.id === id)) return;
      state.template = id;
      persistAndRender();
    },
    setLangMode(m) {
      state.langMode = m;
      persistAndRender();
    },
    setDocType(m) {
      state.docType = m;
      persistAndRender();
    },
    downloadPdf,
    downloadBoth,
    makePdf,
    getState: () => state,
    totals: () => totals(),
    fromTwinform,
    parseImportPayload,
    isPro,
  };

  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1") state = exampleState();
  if (params.get("template") && TEMPLATES.some((x) => x.id === params.get("template"))) {
    state.template = params.get("template");
  }
  if (params.get("lang") === "en" || params.get("lang") === "zh" || params.get("lang") === "both") {
    state.langMode = params.get("lang");
  }
  if (params.get("type") === "packing" || params.get("type") === "invoice") state.docType = params.get("type");
  if (params.get("ui") === "en" || params.get("ui") === "zh") {
    uiLang = params.get("ui");
    try {
      localStorage.setItem(STORAGE_UI, uiLang);
    } catch (_) {}
  }

  const bootPromise = bootLicense().then(() => {
    render();
    return waitFonts().then(() => {
      scalePreview();
      checkOverflow();
    });
  });
  window.Twinpack.ready = () => bootPromise;
})();
