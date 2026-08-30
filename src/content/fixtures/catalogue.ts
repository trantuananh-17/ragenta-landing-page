import type { Locale } from "@/i18n/config";

/**
 * Models, agent tools and data connectors available inside Ragenta.
 *
 * This is the fixture behind `GET /v1/public/catalogue`. When the backend
 * lands, the same fields come from there and this file can be deleted.
 */
type CatalogueSeed = {
  name: string;
  featured: boolean;
  tags: Record<Locale, string[]>;
  desc: Record<Locale, string>;
};

export const CATALOGUE_SEED: CatalogueSeed[] = [
  {
    name: "Claude Opus 4.5",
    featured: true,
    tags: { en: ["Chat model", "Reasoning"], vi: ["Mô hình chat", "Suy luận"] },
    desc: {
      en: "Long-context reasoning model. The default for agents that plan multi-step work and read large documents end to end.",
      vi: "Mô hình suy luận ngữ cảnh dài. Mặc định cho các agent phải lập kế hoạch nhiều bước và đọc trọn tài liệu dài.",
    },
  },
  {
    name: "GPT-5",
    featured: true,
    tags: { en: ["Chat model", "Tool use"], vi: ["Mô hình chat", "Gọi công cụ"] },
    desc: {
      en: "General-purpose chat model with strong function calling. A good fit for tool-heavy agents and structured extraction.",
      vi: "Mô hình chat đa dụng, gọi hàm tốt. Phù hợp cho agent dùng nhiều công cụ và bài toán trích xuất có cấu trúc.",
    },
  },
  {
    name: "Gemini 3 Pro",
    featured: true,
    tags: { en: ["Chat model", "Multimodal"], vi: ["Mô hình chat", "Đa phương thức"] },
    desc: {
      en: "Multimodal model that reads scanned PDFs, screenshots and diagrams alongside text in the same conversation.",
      vi: "Mô hình đa phương thức, đọc được PDF scan, ảnh chụp màn hình và sơ đồ cùng lúc với văn bản trong một hội thoại.",
    },
  },
  {
    name: "bge-m3",
    featured: true,
    tags: { en: ["Embedding", "Multilingual"], vi: ["Embedding", "Đa ngôn ngữ"] },
    desc: {
      en: "Multilingual embedding model covering Vietnamese and English in one vector space — no separate index per language.",
      vi: "Mô hình embedding đa ngôn ngữ, gộp tiếng Việt và tiếng Anh vào cùng một không gian vector — không cần index riêng theo ngôn ngữ.",
    },
  },
  {
    name: "Cohere Rerank 3",
    featured: true,
    tags: { en: ["Reranking", "Retrieval"], vi: ["Rerank", "Truy hồi"] },
    desc: {
      en: "Cross-encoder reranker that reorders retrieved chunks by true relevance before they reach the model's context.",
      vi: "Cross-encoder sắp xếp lại các đoạn đã truy hồi theo mức liên quan thật, trước khi đưa vào ngữ cảnh của mô hình.",
    },
  },
  {
    name: "Llama 4 Maverick",
    featured: false,
    tags: { en: ["Chat model", "Self-hosted"], vi: ["Mô hình chat", "Tự vận hành"] },
    desc: {
      en: "Open-weight model you can run inside your own VPC when data must never leave your network.",
      vi: "Mô hình open-weight chạy được trong VPC của bạn, dùng khi dữ liệu tuyệt đối không được rời khỏi hệ thống nội bộ.",
    },
  },
  {
    name: "Qwen3",
    featured: false,
    tags: { en: ["Chat model", "Self-hosted"], vi: ["Mô hình chat", "Tự vận hành"] },
    desc: {
      en: "Open-weight model with strong Vietnamese and Chinese performance at a low cost per token.",
      vi: "Mô hình open-weight mạnh về tiếng Việt và tiếng Trung, chi phí trên mỗi token thấp.",
    },
  },
  {
    name: "Voyage 3",
    featured: false,
    tags: { en: ["Embedding", "Retrieval"], vi: ["Embedding", "Truy hồi"] },
    desc: {
      en: "High-recall embedding model tuned for long technical documents and code.",
      vi: "Mô hình embedding recall cao, tối ưu cho tài liệu kỹ thuật dài và mã nguồn.",
    },
  },
  {
    name: "Whisper Large v3",
    featured: false,
    tags: { en: ["Speech", "Ingestion"], vi: ["Giọng nói", "Nạp dữ liệu"] },
    desc: {
      en: "Transcribes meeting recordings and call logs into the knowledge base with speaker turns preserved.",
      vi: "Chuyển bản ghi cuộc họp và lịch sử cuộc gọi thành văn bản đưa vào knowledge base, giữ nguyên lượt nói của từng người.",
    },
  },
  {
    name: "Document OCR",
    featured: false,
    tags: { en: ["Ingestion", "Parsing"], vi: ["Nạp dữ liệu", "Bóc tách"] },
    desc: {
      en: "Layout-aware OCR for scanned contracts and forms — tables and headers survive the conversion to text.",
      vi: "OCR hiểu bố cục cho hợp đồng và biểu mẫu scan — bảng và tiêu đề vẫn giữ nguyên cấu trúc sau khi chuyển thành văn bản.",
    },
  },
  {
    name: "Table Extractor",
    featured: false,
    tags: { en: ["Ingestion", "Parsing"], vi: ["Nạp dữ liệu", "Bóc tách"] },
    desc: {
      en: "Pulls tables out of PDFs and spreadsheets as structured rows so the agent can compute over them, not just quote them.",
      vi: "Bóc bảng từ PDF và bảng tính thành các dòng có cấu trúc, để agent tính toán được chứ không chỉ trích dẫn.",
    },
  },
  {
    name: "Semantic Chunker",
    featured: false,
    tags: { en: ["Ingestion", "Retrieval"], vi: ["Nạp dữ liệu", "Truy hồi"] },
    desc: {
      en: "Splits documents on meaning rather than character count, so a clause is never cut in half across two chunks.",
      vi: "Cắt tài liệu theo ngữ nghĩa thay vì đếm ký tự, nên một điều khoản không bao giờ bị cắt đôi giữa hai chunk.",
    },
  },
  {
    name: "Hybrid Search",
    featured: false,
    tags: { en: ["Retrieval", "Search"], vi: ["Truy hồi", "Tìm kiếm"] },
    desc: {
      en: "Combines vector similarity with BM25 keyword matching so exact identifiers and part numbers are still found.",
      vi: "Kết hợp tương đồng vector với so khớp từ khoá BM25, để mã định danh và mã sản phẩm vẫn được tìm thấy chính xác.",
    },
  },
  {
    name: "Web Search",
    featured: false,
    tags: { en: ["Agent tool", "External"], vi: ["Công cụ agent", "Bên ngoài"] },
    desc: {
      en: "Lets an agent look something up on the public web and cite the page it used.",
      vi: "Cho phép agent tra cứu trên web công khai và trích dẫn đúng trang đã dùng.",
    },
  },
  {
    name: "SQL Query",
    featured: false,
    tags: { en: ["Agent tool", "Data"], vi: ["Công cụ agent", "Dữ liệu"] },
    desc: {
      en: "Read-only SQL against a connected warehouse, scoped to the tables a workspace is allowed to see.",
      vi: "Truy vấn SQL chỉ đọc trên warehouse đã kết nối, giới hạn đúng những bảng workspace được phép xem.",
    },
  },
  {
    name: "Code Interpreter",
    featured: false,
    tags: { en: ["Agent tool", "Compute"], vi: ["Công cụ agent", "Tính toán"] },
    desc: {
      en: "Runs Python in an isolated sandbox to compute, chart or reshape data the agent has retrieved.",
      vi: "Chạy Python trong sandbox cô lập để tính toán, vẽ biểu đồ hoặc biến đổi dữ liệu mà agent đã truy hồi.",
    },
  },
  {
    name: "HTTP Request",
    featured: false,
    tags: { en: ["Agent tool", "External"], vi: ["Công cụ agent", "Bên ngoài"] },
    desc: {
      en: "Calls an internal API with credentials held server-side, so a key is never exposed to the model.",
      vi: "Gọi API nội bộ với thông tin xác thực giữ ở phía máy chủ, không bao giờ lộ khoá cho mô hình.",
    },
  },
  {
    name: "MCP Server",
    featured: false,
    tags: { en: ["Agent tool", "Extensibility"], vi: ["Công cụ agent", "Mở rộng"] },
    desc: {
      en: "Attach any Model Context Protocol server and its tools appear to the agent like built-in ones.",
      vi: "Gắn bất kỳ máy chủ Model Context Protocol nào, công cụ của nó xuất hiện với agent như công cụ có sẵn.",
    },
  },
  {
    name: "Google Drive",
    featured: false,
    tags: { en: ["Connector", "Documents"], vi: ["Kết nối", "Tài liệu"] },
    desc: {
      en: "Syncs Docs, Sheets and PDFs continuously, and honours the file permissions each member already has.",
      vi: "Đồng bộ liên tục Docs, Sheets và PDF, đồng thời tôn trọng quyền truy cập file mà từng thành viên đang có.",
    },
  },
  {
    name: "Notion",
    featured: false,
    tags: { en: ["Connector", "Wiki"], vi: ["Kết nối", "Wiki"] },
    desc: {
      en: "Indexes pages and databases, keeping block structure so answers can link back to the exact block.",
      vi: "Index trang và database, giữ nguyên cấu trúc block để câu trả lời trỏ ngược về đúng block gốc.",
    },
  },
  {
    name: "Confluence",
    featured: false,
    tags: { en: ["Connector", "Wiki"], vi: ["Kết nối", "Wiki"] },
    desc: {
      en: "Mirrors spaces and page trees, with archived pages excluded from retrieval automatically.",
      vi: "Đồng bộ space và cây trang, tự động loại các trang đã lưu trữ ra khỏi truy hồi.",
    },
  },
  {
    name: "Slack",
    featured: false,
    tags: { en: ["Connector", "Conversations"], vi: ["Kết nối", "Hội thoại"] },
    desc: {
      en: "Indexes public channel history and answers in-thread, so the agent works where the team already is.",
      vi: "Index lịch sử kênh công khai và trả lời ngay trong thread, để agent làm việc đúng nơi cả nhóm đang ở.",
    },
  },
  {
    name: "Amazon S3",
    featured: false,
    tags: { en: ["Connector", "Storage"], vi: ["Kết nối", "Lưu trữ"] },
    desc: {
      en: "Watches a bucket prefix and ingests new objects as they land, with no upload step for your team.",
      vi: "Theo dõi một prefix trong bucket và nạp object mới ngay khi xuất hiện, nhóm của bạn không phải upload thủ công.",
    },
  },
  {
    name: "PostgreSQL",
    featured: false,
    tags: { en: ["Connector", "Data"], vi: ["Kết nối", "Dữ liệu"] },
    desc: {
      en: "Exposes selected tables and views as a queryable source alongside your documents.",
      vi: "Đưa các bảng và view được chọn thành nguồn truy vấn song song với tài liệu của bạn.",
    },
  },
  {
    name: "Zendesk",
    featured: false,
    tags: { en: ["Connector", "Support"], vi: ["Kết nối", "Hỗ trợ"] },
    desc: {
      en: "Brings resolved tickets and help-centre articles in as grounding for support answers.",
      vi: "Đưa ticket đã xử lý và bài viết help-center vào làm căn cứ cho câu trả lời hỗ trợ.",
    },
  },
  {
    name: "Answer Evaluator",
    featured: false,
    tags: { en: ["Evaluation", "Quality"], vi: ["Đánh giá", "Chất lượng"] },
    desc: {
      en: "Scores groundedness, citation coverage and answer relevance on every run, so regressions surface before users report them.",
      vi: "Chấm điểm mức bám nguồn, độ phủ trích dẫn và độ liên quan cho từng lượt chạy, để phát hiện suy giảm chất lượng trước khi người dùng phản ánh.",
    },
  },
];
