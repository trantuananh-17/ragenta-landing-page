import type { Locale } from "@/i18n/config";
import type { ChangelogEntryType } from "@/content/types";

/** Fixture behind `GET /v1/public/changelog`. */
export type ChangelogSeed = {
  id: string;
  date: string;
  version: string | null;
  type: ChangelogEntryType;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  bullets?: Record<Locale, string[]>;
  sections?: {
    heading: Record<Locale, string>;
    body: Record<Locale, string>;
    bullets?: Record<Locale, string[]>;
  }[];
};

export const CHANGELOG_SEED: ChangelogSeed[] = [
  {
    id: "cl-1-6",
    date: "2026-08-24",
    version: "1.6",
    type: "Release",
    title: {
      en: "Agent Skills — reusable playbooks for your whole workspace",
      vi: "Agent Skills — playbook dùng lại được cho cả workspace",
    },
    excerpt: {
      en: "Turn a prompt that works into a named skill anyone on the team can invoke, with its tools, sources and output format fixed.",
      vi: "Biến một prompt đã chạy tốt thành một skill có tên, để cả nhóm gọi lại được, kèm sẵn công cụ, nguồn dữ liệu và định dạng đầu ra.",
    },
    sections: [
      {
        heading: {
          en: "Define once, run from anywhere",
          vi: "Định nghĩa một lần, gọi từ mọi nơi",
        },
        body: {
          en: "A skill bundles the instruction, the knowledge bases it may read, the tools it may call and the shape of its answer. Invoke it from chat with a slash command, from the API, or on a schedule.",
          vi: "Một skill gói gọn phần hướng dẫn, các knowledge base nó được đọc, các công cụ nó được gọi và định dạng câu trả lời. Gọi nó từ khung chat bằng lệnh gạch chéo, từ API, hoặc theo lịch định sẵn.",
        },
      },
      {
        heading: {
          en: "Versioned, with a diff",
          vi: "Có phiên bản, có diff",
        },
        body: {
          en: "Every edit creates a version. Compare two versions side by side and roll back if answer quality drops.",
          vi: "Mỗi lần sửa tạo ra một phiên bản. So sánh hai phiên bản cạnh nhau và quay lui nếu chất lượng câu trả lời giảm.",
        },
        bullets: {
          en: [
            "Workspace-wide or project-scoped",
            "Per-skill evaluation runs",
            "Usage and cost broken down per skill",
          ],
          vi: [
            "Phạm vi toàn workspace hoặc riêng từng project",
            "Chạy đánh giá riêng cho từng skill",
            "Thống kê mức dùng và chi phí theo từng skill",
          ],
        },
      },
    ],
  },
  {
    id: "cl-rerank",
    date: "2026-08-19",
    version: null,
    type: "Model",
    title: {
      en: "Cohere Rerank 3 available on every plan",
      vi: "Cohere Rerank 3 đã có ở mọi gói",
    },
    excerpt: {
      en: "Reranking moved from a Team-only feature to the default retrieval pipeline, with a measurable jump in citation accuracy on long documents.",
      vi: "Rerank chuyển từ tính năng riêng gói Team thành mặc định trong pipeline truy hồi, cải thiện rõ độ chính xác trích dẫn trên tài liệu dài.",
    },
  },
  {
    id: "cl-permissions",
    date: "2026-08-11",
    version: null,
    type: "Integration",
    title: {
      en: "Google Drive and Notion connectors now sync permissions",
      vi: "Connector Google Drive và Notion đã đồng bộ phân quyền",
    },
    excerpt: {
      en: "Retrieval filters by the source system's own access control, so a member only ever sees passages from files they can already open.",
      vi: "Truy hồi lọc theo đúng phân quyền của hệ thống nguồn, nên mỗi thành viên chỉ thấy đoạn văn từ những file họ vốn đã mở được.",
    },
    sections: [
      {
        heading: {
          en: "Enforced in the query, not after it",
          vi: "Áp đặt trong truy vấn, không phải sau truy vấn",
        },
        body: {
          en: "The permission scope is part of the vector search itself. A file moved into a restricted folder drops out of retrieval on the next sync rather than the next full re-index.",
          vi: "Phạm vi quyền là một phần của chính truy vấn vector. Một file chuyển vào thư mục hạn chế sẽ biến mất khỏi truy hồi ở lần đồng bộ kế tiếp, không phải chờ lần re-index toàn bộ.",
        },
      },
    ],
  },
  {
    id: "cl-1-5",
    date: "2026-07-30",
    version: "1.5",
    type: "Release",
    title: {
      en: "Retrieval trace on every answer",
      vi: "Retrieval trace cho mọi câu trả lời",
    },
    excerpt: {
      en: "Open any answer to see every candidate passage, its score, and whether it made the final context — the fastest way to tell a retrieval failure from a generation failure.",
      vi: "Mở bất kỳ câu trả lời nào để xem toàn bộ đoạn ứng viên, điểm số và việc nó có lọt vào ngữ cảnh cuối hay không — cách nhanh nhất để phân biệt lỗi truy hồi với lỗi sinh văn bản.",
    },
    bullets: {
      en: [
        "Per-claim citation highlighting",
        "Score breakdown for vector and keyword matching",
        "One-click re-run with a different model",
      ],
      vi: [
        "Đánh dấu trích dẫn theo từng khẳng định",
        "Chi tiết điểm số của cả vector lẫn từ khoá",
        "Chạy lại bằng mô hình khác chỉ với một cú nhấp",
      ],
    },
  },
  {
    id: "cl-hybrid",
    date: "2026-07-17",
    version: null,
    type: "Improvement",
    title: {
      en: "Hybrid search is now the default",
      vi: "Hybrid search trở thành mặc định",
    },
    excerpt: {
      en: "Vector similarity combined with BM25 keyword matching, so exact part numbers, error codes and ticket IDs are found again.",
      vi: "Kết hợp tương đồng vector với so khớp từ khoá BM25, để mã sản phẩm, mã lỗi và mã ticket được tìm thấy chính xác trở lại.",
    },
  },
  {
    id: "cl-vietnamese",
    date: "2026-07-02",
    version: null,
    type: "Improvement",
    title: {
      en: "Vietnamese retrieval quality",
      vi: "Chất lượng truy hồi tiếng Việt",
    },
    excerpt: {
      en: "Unicode normalisation at ingestion plus a bigram keyword index lift recall noticeably on Vietnamese corpora and on mixed-language internal docs.",
      vi: "Chuẩn hoá Unicode khi nạp dữ liệu cộng với index từ khoá bigram giúp tăng rõ recall trên kho tiếng Việt và tài liệu nội bộ trộn ngôn ngữ.",
    },
  },
  {
    id: "cl-1-4",
    date: "2026-06-18",
    version: "1.4",
    type: "Release",
    title: {
      en: "Parallel subagents",
      vi: "Subagent chạy song song",
    },
    excerpt: {
      en: "A research question now fans out across independent subagents, each working one sub-question and streaming its findings back as it finishes.",
      vi: "Một câu hỏi nghiên cứu giờ được chia cho nhiều subagent độc lập, mỗi subagent xử lý một câu hỏi con và trả kết quả về ngay khi xong.",
    },
    sections: [
      {
        heading: {
          en: "Bounded by design",
          vi: "Có trần ngay từ thiết kế",
        },
        body: {
          en: "Every run carries a step budget and a tool-call budget. Progress streams live, so a long run can be stopped by a person rather than by a timeout.",
          vi: "Mỗi lượt chạy đều có ngân sách số bước và số lần gọi công cụ. Tiến độ hiển thị trực tiếp, nên một lượt chạy dài có thể do con người dừng lại chứ không phải chờ timeout.",
        },
      },
    ],
  },
  {
    id: "cl-mcp",
    date: "2026-06-04",
    version: null,
    type: "Integration",
    title: {
      en: "Model Context Protocol servers",
      vi: "Máy chủ Model Context Protocol",
    },
    excerpt: {
      en: "Attach any MCP server and its tools appear to your agents alongside the built-in ones, with per-workspace credentials held server-side.",
      vi: "Gắn bất kỳ máy chủ MCP nào, công cụ của nó xuất hiện với agent như công cụ có sẵn, thông tin xác thực theo từng workspace được giữ ở phía máy chủ.",
    },
  },
  {
    id: "cl-eval",
    date: "2026-05-21",
    version: null,
    type: "Improvement",
    title: {
      en: "Evaluation runs on every configuration change",
      vi: "Tự động chạy đánh giá ở mọi thay đổi cấu hình",
    },
    excerpt: {
      en: "Point an evaluation set at a knowledge base and Ragenta re-scores groundedness, citation coverage and retrieval hit rate whenever the configuration changes.",
      vi: "Gắn một tập đánh giá vào knowledge base, Ragenta sẽ chấm lại mức bám nguồn, độ phủ trích dẫn và tỷ lệ truy hồi trúng mỗi khi cấu hình thay đổi.",
    },
  },
  {
    id: "cl-1-3",
    date: "2026-05-07",
    version: "1.3",
    type: "Fix",
    title: {
      en: "Large PDF ingestion no longer stalls at 90%",
      vi: "Nạp PDF lớn không còn treo ở mức 90%",
    },
    excerpt: {
      en: "Documents above roughly 400 pages could stall during the embedding stage when a single page produced an unusually long table. Fixed, with a regression test on the ingestion queue.",
      vi: "Tài liệu trên khoảng 400 trang có thể bị treo ở bước embedding khi một trang sinh ra bảng dài bất thường. Đã sửa, kèm bài test hồi quy cho hàng đợi nạp dữ liệu.",
    },
  },
];
