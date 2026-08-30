import type { Locale } from "@/i18n/config";

/**
 * Fixture behind `GET /v1/public/posts`. One entry per article, with every
 * translatable field keyed by locale so the shape matches what a localized
 * content API returns.
 */
export type PostSeed = {
  id: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  tags: Record<Locale, string[]>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  bodyMd: Record<Locale, string>;
};

export const POST_SEED: PostSeed[] = [
  {
    id: "post-chunking",
    slug: "chunking-decides-your-rag-quality",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingMinutes: 7,
    tags: { en: ["Retrieval", "Engineering"], vi: ["Truy hồi", "Kỹ thuật"] },
    title: {
      en: "Chunking decides your RAG quality more than your model does",
      vi: "Cách cắt chunk quyết định chất lượng RAG nhiều hơn cả mô hình bạn chọn",
    },
    excerpt: {
      en: "Teams reach for a bigger model when answers go wrong. Nine times out of ten the retrieval never surfaced the right passage in the first place.",
      vi: "Khi câu trả lời sai, nhiều đội vội đổi sang mô hình lớn hơn. Chín trên mười lần, vấn đề thật là truy hồi chưa bao giờ lấy đúng đoạn cần dùng.",
    },
    bodyMd: {
      en: `A retrieval system can only be as good as the passages it hands the model. If the answer lives in a paragraph that was cut in half at ingestion time, no amount of model quality recovers it.

## Fixed-size chunking loses the thing you were looking for

Splitting on a character count is easy to implement and easy to reason about, which is why almost every project starts there. It also cuts through the middle of clauses, table rows and numbered lists. A contract term that reads "either party may terminate with **thirty days** written notice" becomes two chunks, and neither one answers the question on its own.

## Split on structure first, size second

In practice the ordering that works is:

1. Respect the document's own structure — headings, list items, table rows, contract clauses.
2. Merge neighbouring units until you approach the target size.
3. Only fall back to a hard split when a single unit is genuinely too large.

That keeps the semantic unit intact and treats the size limit as a ceiling rather than a grid.

## Overlap is a patch, not a design

A sliding overlap of a couple of hundred tokens hides some of the damage from fixed-size splitting, at the cost of storing the same text several times and pushing duplicates into the model's context. It is worth having, but if overlap is doing heavy lifting, the chunker is the thing to fix.

## Measure it before you tune it

Groundedness and citation coverage are the two numbers that move when chunking changes. Set up a small evaluation set of real questions with known correct sources, then change one thing at a time. Most teams find a bigger jump here than from any model swap.`,
      vi: `Hệ thống truy hồi chỉ tốt bằng đúng những đoạn văn nó đưa cho mô hình. Nếu câu trả lời nằm trong một đoạn đã bị cắt đôi lúc nạp dữ liệu, mô hình mạnh đến đâu cũng không cứu được.

## Cắt theo kích thước cố định làm mất chính thứ bạn cần tìm

Cắt theo số ký tự dễ triển khai và dễ hình dung, nên hầu hết dự án đều bắt đầu như vậy. Nhưng nó cũng cắt ngang giữa điều khoản, giữa dòng bảng và giữa danh sách đánh số. Một điều khoản hợp đồng ghi "mỗi bên có quyền chấm dứt sau **ba mươi ngày** thông báo bằng văn bản" bị tách thành hai chunk, và không chunk nào tự trả lời được câu hỏi.

## Ưu tiên cấu trúc trước, kích thước sau

Thứ tự chạy tốt trong thực tế:

1. Tôn trọng cấu trúc sẵn có của tài liệu — tiêu đề, mục danh sách, dòng bảng, điều khoản hợp đồng.
2. Gộp các đơn vị liền kề cho tới khi tiệm cận kích thước mục tiêu.
3. Chỉ cắt cứng khi một đơn vị thực sự quá lớn.

Cách này giữ nguyên đơn vị ngữ nghĩa và coi giới hạn kích thước là trần, không phải một cái lưới chia đều.

## Overlap là miếng vá, không phải thiết kế

Cho các chunk chồng lấn vài trăm token che bớt được thiệt hại của cách cắt cố định, đổi lại phải lưu trùng văn bản và đẩy nội dung lặp vào ngữ cảnh mô hình. Nên có, nhưng nếu overlap đang gánh phần lớn chất lượng thì thứ cần sửa là bộ chunker.

## Đo trước, tinh chỉnh sau

Hai chỉ số dịch chuyển rõ nhất khi đổi cách chunk là mức bám nguồn và độ phủ trích dẫn. Hãy dựng một tập đánh giá nhỏ gồm câu hỏi thật kèm nguồn đúng đã biết, rồi thay đổi từng yếu tố một. Phần lớn các đội thấy mức cải thiện ở đây lớn hơn bất kỳ lần đổi mô hình nào.`,
    },
  },
  {
    id: "post-citations",
    slug: "answers-without-citations-are-not-answers",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-12",
    readingMinutes: 5,
    tags: { en: ["Trust", "Product"], vi: ["Độ tin cậy", "Sản phẩm"] },
    title: {
      en: "An answer without a citation is a guess with good grammar",
      vi: "Câu trả lời không trích dẫn chỉ là phỏng đoán được viết đúng ngữ pháp",
    },
    excerpt: {
      en: "Citations are not a nice-to-have on top of a RAG product. They are the only mechanism a reader has to decide whether to trust what they just read.",
      vi: "Trích dẫn không phải phần trang trí thêm cho sản phẩm RAG. Đó là cơ chế duy nhất để người đọc quyết định có nên tin những gì vừa đọc hay không.",
    },
    bodyMd: {
      en: `The first thing a sceptical reader does with a generated answer is look for where it came from. If there is nowhere to look, they either trust it blindly or discard it. Both outcomes are bad.

## Cite the passage, not the document

"Source: employee-handbook.pdf" is barely better than nothing when the handbook is 90 pages. Link to the chunk, and show the surrounding sentences on hover. The reader should be able to confirm the claim in about three seconds.

## Show what was retrieved but not used

A retrieval trace that lists every candidate passage — with its score, and whether it made the final context — turns debugging from guesswork into reading. When an answer is wrong, the trace usually tells you immediately whether the failure was retrieval or generation.

## Make an ungrounded answer visibly ungrounded

If the model produced a sentence that no retrieved passage supports, say so in the interface rather than letting it sit next to well-sourced sentences. A confident paragraph with one silent invention in it is more dangerous than an answer that admits it does not know.`,
      vi: `Việc đầu tiên một người đọc khó tính làm với câu trả lời do AI sinh ra là tìm xem nó lấy từ đâu. Nếu không có chỗ nào để nhìn, họ hoặc tin mù quáng, hoặc bỏ hẳn. Cả hai đều là kết cục xấu.

## Trích dẫn đúng đoạn, không phải cả tài liệu

"Nguồn: so-tay-nhan-vien.pdf" gần như vô nghĩa khi cuốn sổ tay dài 90 trang. Hãy trỏ tới đúng chunk, và hiển thị vài câu xung quanh khi người dùng rê chuột. Người đọc phải xác nhận được thông tin trong khoảng ba giây.

## Cho thấy cả những gì đã truy hồi nhưng không dùng

Một retrieval trace liệt kê mọi đoạn ứng viên — kèm điểm số và trạng thái có được đưa vào ngữ cảnh cuối hay không — biến việc gỡ lỗi từ đoán mò thành đọc hiểu. Khi câu trả lời sai, trace thường cho biết ngay lỗi nằm ở truy hồi hay ở khâu sinh văn bản.

## Đánh dấu rõ phần không có nguồn

Nếu mô hình sinh ra một câu mà không đoạn truy hồi nào chống lưng, hãy nói rõ trên giao diện thay vì để nó nằm lẫn giữa các câu có nguồn. Một đoạn văn tự tin nhưng lẫn một chi tiết bịa âm thầm còn nguy hiểm hơn câu trả lời thừa nhận là không biết.`,
    },
  },
  {
    id: "post-agents-vs-workflows",
    slug: "when-an-agent-beats-a-workflow",
    publishedAt: "2026-07-29",
    updatedAt: "2026-07-29",
    readingMinutes: 6,
    tags: { en: ["Agents", "Architecture"], vi: ["Agent", "Kiến trúc"] },
    title: {
      en: "When an agent beats a workflow — and when it does not",
      vi: "Khi nào agent thắng workflow — và khi nào thì không",
    },
    excerpt: {
      en: "Agents are the right answer when the steps depend on what the previous step found. For everything else, a fixed pipeline is cheaper, faster and easier to debug.",
      vi: "Agent là lựa chọn đúng khi các bước phụ thuộc vào kết quả bước trước. Còn lại, một pipeline cố định rẻ hơn, nhanh hơn và dễ gỡ lỗi hơn.",
    },
    bodyMd: {
      en: `There is a simple test for whether a task needs an agent: can you draw the flowchart in advance?

## If you can draw it, build the pipeline

Classify a ticket, extract five fields, look the customer up, write a reply. The steps never change. A fixed pipeline runs it in a fraction of the time, costs a fraction of the tokens, and fails in ways you can read from a log.

## If the next step depends on the last one, use an agent

"Find out why revenue in the Vietnam region dropped last quarter" cannot be drawn in advance. The second query depends on what the first one returned. That branching is exactly what an agent loop is for.

## Give the agent a budget

An open-ended loop with no ceiling is how a research task quietly becomes an expensive one. Cap the number of steps, cap the tool calls, and stream progress so a human can stop it. In practice the cap is almost never hit — but knowing it exists is what makes the feature shippable.

## Keep the tools small and boring

An agent that can call twelve well-named, single-purpose tools outperforms one with three tools that each take a configuration object. Ambiguity in a tool signature turns into retries, and retries turn into latency.`,
      vi: `Có một phép thử đơn giản để biết một tác vụ có cần agent hay không: bạn vẽ được sơ đồ luồng trước hay không?

## Vẽ được thì hãy dựng pipeline

Phân loại ticket, trích xuất năm trường, tra cứu khách hàng, soạn phản hồi. Các bước không bao giờ đổi. Một pipeline cố định chạy nhanh hơn nhiều lần, tốn ít token hơn nhiều lần, và khi hỏng thì đọc log là biết.

## Bước sau phụ thuộc bước trước thì dùng agent

"Tìm hiểu vì sao doanh thu khu vực Việt Nam giảm trong quý vừa rồi" thì không vẽ trước được. Truy vấn thứ hai phụ thuộc vào kết quả truy vấn thứ nhất. Chính sự rẽ nhánh đó là lý do vòng lặp agent tồn tại.

## Cấp ngân sách cho agent

Một vòng lặp mở không có trần chính là cách một tác vụ nghiên cứu âm thầm trở nên tốn kém. Hãy giới hạn số bước, giới hạn số lần gọi công cụ, và stream tiến độ để con người có thể dừng lại. Thực tế gần như không bao giờ chạm trần — nhưng có trần mới dám đưa tính năng ra production.

## Giữ công cụ nhỏ và nhàm chán

Một agent gọi được mười hai công cụ đặt tên rõ ràng, mỗi công cụ làm một việc, hoạt động tốt hơn agent chỉ có ba công cụ mà mỗi cái nhận một object cấu hình. Mơ hồ trong chữ ký công cụ sẽ biến thành retry, và retry biến thành độ trễ.`,
    },
  },
  {
    id: "post-permissions",
    slug: "permission-aware-retrieval",
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    readingMinutes: 6,
    tags: { en: ["Security", "Retrieval"], vi: ["Bảo mật", "Truy hồi"] },
    title: {
      en: "Permission-aware retrieval, or how not to leak the salary sheet",
      vi: "Truy hồi có phân quyền, hay cách để không rò rỉ bảng lương",
    },
    excerpt: {
      en: "The fastest way to lose trust in an internal assistant is for it to answer one question it should not have been able to answer.",
      vi: "Cách nhanh nhất để đánh mất niềm tin vào một trợ lý nội bộ là để nó trả lời đúng một câu mà lẽ ra nó không được phép trả lời.",
    },
    bodyMd: {
      en: `An assistant that indexes everything and answers everyone is a data-leak incident with a chat interface.

## Filter in the query, never after

Fetching the top passages and then dropping the ones the user may not see looks equivalent and is not. It leaks through result counts, through latency, and through the moment someone forgets the post-filter on a new endpoint. The permission scope belongs in the vector query itself.

## Carry the source system's ACL

Most documents already have an owner and an audience in the system they came from. Ingest that alongside the text and keep it in sync — a file that moves to a restricted folder must drop out of retrieval on the next sync, not the next re-index.

## Re-check at answer time

Permissions change between ingestion and the question being asked. The check that matters is the one at query time, against the actor resolved from the session — never against an identifier the client supplied.

## Log the identifiers, not the content

An audit trail needs to record who asked, what was retrieved, and which sources were cited. It does not need the passage text, and storing it turns your log store into a second copy of the sensitive data.`,
      vi: `Một trợ lý index tất cả và trả lời tất cả mọi người thực chất là một sự cố rò rỉ dữ liệu có kèm giao diện chat.

## Lọc ngay trong truy vấn, không lọc sau

Lấy các đoạn điểm cao rồi mới bỏ đi những gì người dùng không được xem trông có vẻ tương đương, nhưng không phải. Nó rò rỉ qua số lượng kết quả, qua độ trễ, và qua đúng khoảnh khắc ai đó quên bước lọc hậu kỳ ở một endpoint mới. Phạm vi quyền phải nằm ngay trong truy vấn vector.

## Mang theo ACL của hệ thống nguồn

Phần lớn tài liệu đã có chủ sở hữu và phạm vi người xem ở hệ thống gốc. Hãy nạp thông tin đó cùng với nội dung và đồng bộ liên tục — một file được chuyển vào thư mục hạn chế phải biến mất khỏi truy hồi ở lần đồng bộ kế tiếp, chứ không phải chờ lần re-index sau.

## Kiểm tra lại tại thời điểm trả lời

Quyền thay đổi giữa lúc nạp dữ liệu và lúc câu hỏi được đặt ra. Phép kiểm tra có ý nghĩa là phép kiểm tra tại thời điểm truy vấn, dựa trên chủ thể phân giải từ phiên đăng nhập — không bao giờ dựa trên định danh do client gửi lên.

## Ghi log định danh, đừng ghi nội dung

Vết kiểm toán cần biết ai hỏi, đã truy hồi những gì và trích dẫn nguồn nào. Nó không cần nội dung đoạn văn, và lưu nội dung sẽ biến kho log thành bản sao thứ hai của dữ liệu nhạy cảm.`,
    },
  },
  {
    id: "post-evaluation",
    slug: "evaluating-rag-without-a-labelled-dataset",
    publishedAt: "2026-06-30",
    updatedAt: "2026-06-30",
    readingMinutes: 8,
    tags: { en: ["Evaluation", "Engineering"], vi: ["Đánh giá", "Kỹ thuật"] },
    title: {
      en: "Evaluating RAG when you have no labelled dataset",
      vi: "Đánh giá RAG khi bạn chưa có tập dữ liệu gán nhãn",
    },
    excerpt: {
      en: "You do not need thousands of labelled pairs to know whether a change helped. You need thirty real questions and the discipline to change one thing at a time.",
      vi: "Bạn không cần hàng nghìn cặp gán nhãn để biết một thay đổi có tốt hơn hay không. Bạn cần ba mươi câu hỏi thật và kỷ luật mỗi lần chỉ đổi một thứ.",
    },
    bodyMd: {
      en: `Every team says they will build an evaluation set "once the product is stable". The product is never stable, and by then every change is a coin flip.

## Start with thirty questions from real users

Pull them from support tickets, from the first week of internal usage, from the questions people asked in Slack before you built anything. Thirty is enough to catch a regression; three hundred is a project.

## Score four things

- **Groundedness** — is every claim supported by a retrieved passage?
- **Citation coverage** — what share of claims carry a link?
- **Retrieval hit rate** — did the correct source appear in the top-k at all?
- **Answer relevance** — did it answer the question that was asked?

The first three can be judged mechanically or by a model. The fourth usually needs a person, which is another reason to keep the set small.

## Separate retrieval failures from generation failures

If the correct passage never made it into the context, tuning the prompt is wasted effort. Retrieval hit rate is what tells you which half of the system to work on, and it is the cheapest metric to collect.

## Run it on every change

An evaluation you run twice a year is a report. An evaluation that runs on every configuration change is a safety net. The value comes almost entirely from the second one.`,
      vi: `Đội nào cũng nói sẽ dựng tập đánh giá "khi sản phẩm ổn định". Sản phẩm không bao giờ ổn định, và đến lúc đó thì mọi thay đổi đều là tung đồng xu.

## Bắt đầu với ba mươi câu hỏi từ người dùng thật

Lấy từ ticket hỗ trợ, từ tuần đầu dùng nội bộ, từ những câu mọi người hỏi nhau trên Slack trước khi bạn xây bất cứ thứ gì. Ba mươi câu là đủ để bắt được suy giảm chất lượng; ba trăm câu thì thành một dự án riêng.

## Chấm bốn thứ

- **Mức bám nguồn** — mọi khẳng định có được một đoạn truy hồi chống lưng không?
- **Độ phủ trích dẫn** — bao nhiêu phần trăm khẳng định có kèm liên kết?
- **Tỷ lệ truy hồi trúng** — nguồn đúng có xuất hiện trong top-k hay không?
- **Độ liên quan của câu trả lời** — nó có trả lời đúng câu được hỏi không?

Ba chỉ số đầu có thể chấm bằng máy hoặc bằng mô hình. Chỉ số thứ tư thường cần con người, và đó là thêm một lý do để giữ tập đánh giá nhỏ.

## Tách lỗi truy hồi khỏi lỗi sinh văn bản

Nếu đoạn văn đúng chưa bao giờ lọt vào ngữ cảnh thì tinh chỉnh prompt là công sức đổ sông. Tỷ lệ truy hồi trúng cho biết cần sửa nửa nào của hệ thống, và đó cũng là chỉ số rẻ nhất để thu thập.

## Chạy nó ở mọi thay đổi

Một bài đánh giá chạy hai lần mỗi năm là một bản báo cáo. Một bài đánh giá chạy ở mọi thay đổi cấu hình là lưới an toàn. Gần như toàn bộ giá trị nằm ở cái thứ hai.`,
    },
  },
  {
    id: "post-vietnamese",
    slug: "retrieval-quality-for-vietnamese-documents",
    publishedAt: "2026-06-12",
    updatedAt: "2026-06-14",
    readingMinutes: 6,
    tags: { en: ["Retrieval", "Multilingual"], vi: ["Truy hồi", "Đa ngôn ngữ"] },
    title: {
      en: "What breaks retrieval quality on Vietnamese documents",
      vi: "Điều gì làm hỏng chất lượng truy hồi trên tài liệu tiếng Việt",
    },
    excerpt: {
      en: "Diacritics, word segmentation and mixed-language sources cause most of the recall loss teams see on Vietnamese corpora — and all three are fixable at ingestion.",
      vi: "Dấu thanh, tách từ và nguồn trộn ngôn ngữ gây ra phần lớn mức mất recall trên kho tài liệu tiếng Việt — và cả ba đều xử lý được ngay từ khâu nạp dữ liệu.",
    },
    bodyMd: {
      en: `A retrieval stack tuned on English corpora tends to lose noticeable recall the first time it meets a Vietnamese document set. The causes are mundane.

## Normalise diacritics once, at ingestion

The same word appears with composed and decomposed Unicode forms depending on which editor produced the file. Normalise to a single form before embedding and before indexing keywords, or the two forms become two different tokens.

## Vietnamese words are not whitespace-delimited concepts

Keyword search that splits on spaces treats "cơ sở dữ liệu" as three unrelated tokens. A segmenter, or a bigram index alongside the unigram one, recovers most of that loss for BM25. The vector side is less sensitive but still benefits.

## Expect mixed-language documents

Internal documentation is rarely monolingual — Vietnamese prose with English product names, error strings and code identifiers. A multilingual embedding model that places both languages in one vector space avoids maintaining a separate index per language and lets an English question retrieve a Vietnamese passage.

## Keep the query in the user's language

Translating the question before retrieval loses named entities and adds a failure point. If your embedding model is genuinely multilingual, retrieve in the language asked and let the generation step handle the language of the reply.`,
      vi: `Một hệ truy hồi được tinh chỉnh trên kho tiếng Anh thường mất recall thấy rõ ở lần đầu gặp bộ tài liệu tiếng Việt. Nguyên nhân đều rất đời thường.

## Chuẩn hoá dấu một lần, ngay khi nạp dữ liệu

Cùng một từ xuất hiện dưới dạng Unicode tổ hợp hoặc dựng sẵn tuỳ trình soạn thảo tạo ra file. Hãy chuẩn hoá về một dạng trước khi embedding và trước khi index từ khoá, nếu không hai dạng sẽ thành hai token khác nhau.

## Từ tiếng Việt không phân tách bằng khoảng trắng

Tìm kiếm từ khoá cắt theo dấu cách sẽ coi "cơ sở dữ liệu" là ba token rời rạc. Một bộ tách từ, hoặc một index bigram đi kèm index unigram, lấy lại được phần lớn mức mất mát đó cho BM25. Phía vector ít nhạy cảm hơn nhưng vẫn được lợi.

## Hãy chuẩn bị cho tài liệu trộn ngôn ngữ

Tài liệu nội bộ hiếm khi thuần một ngôn ngữ — văn tiếng Việt lẫn tên sản phẩm tiếng Anh, chuỗi lỗi và định danh trong mã nguồn. Một mô hình embedding đa ngôn ngữ đặt cả hai ngôn ngữ vào cùng không gian vector giúp khỏi phải duy trì index riêng cho từng ngôn ngữ, và cho phép câu hỏi tiếng Anh truy hồi đúng đoạn tiếng Việt.

## Giữ nguyên ngôn ngữ của câu hỏi

Dịch câu hỏi trước khi truy hồi làm mất tên riêng và thêm một điểm hỏng. Nếu mô hình embedding thực sự đa ngôn ngữ, hãy truy hồi bằng đúng ngôn ngữ người dùng hỏi và để bước sinh văn bản lo phần ngôn ngữ của câu trả lời.`,
    },
  },
];
