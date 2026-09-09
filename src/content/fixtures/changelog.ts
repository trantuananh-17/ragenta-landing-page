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
    id: "cl-2026-09-09-improvement",
    date: "2026-09-09",
    version: null,
    type: "Improvement",
    title: {
      en: "Describe the agent you want, and the canvas draws it",
      vi: "Mô tả agent bạn muốn, canvas sẽ vẽ ra",
    },
    excerpt: {
      en: "A sentence becomes a working draft on the canvas — and a change to an agent can now be measured against the version it replaced.",
      vi: "Một câu mô tả trở thành bản nháp chạy được trên canvas — và một thay đổi trên agent giờ có thể đo được so với phiên bản mà nó thay thế.",
    },
    sections: [
      {
        heading: {
          en: "From a sentence to a graph",
          vi: "Từ một câu thành một đồ thị",
        },
        body: {
          en: "The blank canvas was the hard part: seventeen step types and no clue which three the job needs. Type what you want the agent to do and Ragenta drafts the steps, the branches and the connections for you to correct. Nothing is saved until you publish a version, so a draft that lands on top of your work costs you a click to undo, not an afternoon.",
          vi: "Canvas trắng là phần khó nhất: mười bảy loại bước và không biết công việc này cần ba loại nào. Gõ điều bạn muốn agent làm, Ragenta phác ra các bước, các nhánh và các kết nối để bạn sửa. Không có gì được lưu cho tới khi bạn xuất bản một phiên bản, nên một bản nháp đè lên công việc của bạn chỉ tốn một cú bấm để hoàn tác, không phải cả buổi chiều.",
        },
        bullets: {
          en: [
            "Every draft is checked before it reaches the canvas — an invented step type or an edge that leads nowhere is refused with the reason",
            "The steps a later one reads from are shown by name, so a prompt can reference them",
            "Replacing existing work always asks first",
          ],
          vi: [
            "Mọi bản nháp đều được kiểm trước khi lên canvas — một loại bước bịa ra hoặc một cạnh nối vào hư không sẽ bị từ chối kèm lý do",
            "Các bước mà bước sau đọc dữ liệu từ đó được hiển thị theo tên, để prompt tham chiếu được",
            "Ghi đè lên công việc đang có luôn hỏi trước",
          ],
        },
      },
      {
        heading: {
          en: "Compare versions on one question",
          vi: "So sánh các phiên bản trên cùng một câu hỏi",
        },
        body: {
          en: "You changed the prompt, swapped the model, added a tool. Did it get better? Send the same input to two or three published versions at once and read the answers side by side, with what each one cost. Then publish the winner, or restore what you had.",
          vi: "Bạn đổi prompt, đổi mô hình, thêm công cụ. Nó có tốt lên không? Gửi cùng một đầu vào tới hai hoặc ba phiên bản đã xuất bản cùng lúc và đọc các câu trả lời cạnh nhau, kèm chi phí của từng cái. Rồi xuất bản cái thắng, hoặc khôi phục cái bạn đang có.",
        },
      },
      {
        heading: {
          en: "A chat that shows its work",
          vi: "Khung chat cho thấy nó đang làm gì",
        },
        body: {
          en: "Answers now stream at a readable pace with a visible ending, hovering a message reveals when it was sent, and a stopped answer says it was stopped instead of just going quiet. When a step fails, the reason is on the step rather than buried in its output.",
          vi: "Câu trả lời giờ hiện dần ở tốc độ đọc được và có điểm kết thúc rõ ràng, rê chuột lên một tin nhắn sẽ hiện thời điểm gửi, và một câu trả lời bị dừng sẽ nói rằng nó đã bị dừng thay vì lặng im. Khi một bước lỗi, lý do nằm ngay trên bước đó chứ không chôn trong phần đầu ra.",
        },
      },
    ],
  },
  {
    id: "cl-1-3",
    date: "2026-09-09",
    version: "1.3",
    type: "Release",
    title: {
      en: "A price you can predict, and a free tier that says what it is",
      vi: "Một mức giá đoán trước được, và gói miễn phí nói đúng bản chất",
    },
    excerpt: {
      en: "Credits instead of message counts, a $9 Starter plan, invoices you can download, and a trial that ends honestly instead of renewing forever.",
      vi: "Tính bằng credit thay vì đếm tin nhắn, thêm gói Starter 9$, hoá đơn tải về được, và một bản dùng thử kết thúc thật thà thay vì gia hạn mãi mãi.",
    },
    sections: [
      {
        heading: {
          en: "One unit, every model",
          vi: "Một đơn vị, mọi mô hình",
        },
        body: {
          en: "Usage is counted in credits. One credit is one input token of a baseline model, and every model spends credits in proportion to what it actually costs — so switching an agent from a cheap model to a frontier one changes the number, not the unit. Every run shows what it spent, per step.",
          vi: "Mức dùng được tính bằng credit. Một credit bằng một token đầu vào của mô hình cơ sở, và mọi mô hình tiêu credit theo đúng tỷ lệ chi phí thật — nên đổi agent từ mô hình rẻ sang mô hình đầu bảng chỉ làm đổi con số, không đổi đơn vị. Mỗi lần chạy đều hiện số đã tiêu, theo từng bước.",
        },
      },
      {
        heading: {
          en: "The free tier is a trial now",
          vi: "Gói miễn phí giờ là bản dùng thử",
        },
        body: {
          en: "New accounts get 20,000 credits once, after verifying their email address, and are not topped up every month. A monthly allowance that never ends is a cost with no end and no reason to ever upgrade. What free is really for — one knowledge base, two agents, one seat, economy models — is unchanged.",
          vi: "Tài khoản mới nhận 20.000 credit một lần, sau khi xác thực địa chỉ email, và không được cộng thêm hằng tháng. Một hạn mức tháng không bao giờ hết là một khoản chi phí không có điểm dừng và cũng không có lý do gì để nâng cấp. Điều mà gói miễn phí thật sự dùng để làm — một knowledge base, hai agent, một chỗ ngồi, mô hình economy — vẫn giữ nguyên.",
        },
        bullets: {
          en: [
            "Starter at $9 a month for one person, with widgets, webhooks and triggers",
            "Pro at $29 per seat, adding API keys, database sources and premium models",
            "Team at $99 flat for five seats",
          ],
          vi: [
            "Starter 9$/tháng cho một người, có widget, webhook và lịch chạy",
            "Pro 29$/chỗ ngồi, thêm API key, nguồn cơ sở dữ liệu và mô hình premium",
            "Team 99$ trọn gói cho năm chỗ ngồi",
          ],
        },
      },
      {
        heading: {
          en: "Buy exactly what you need",
          vi: "Mua đúng thứ bạn cần",
        },
        body: {
          en: "Top-up packs remain, and you can now name your own amount from $10 upward. Payment history, downloadable invoices and the date your plan renews are all on the billing screen — including whether it will renew at all.",
          vi: "Các gói credit nạp thêm vẫn còn, và giờ bạn tự nhập số tiền từ 10$ trở lên. Lịch sử thanh toán, hoá đơn tải về được và ngày gia hạn gói đều nằm trên màn hình thanh toán — kèm cả việc nó có gia hạn hay không.",
        },
      },
    ],
  },
  {
    id: "cl-2026-09-08-integration",
    date: "2026-09-08",
    version: null,
    type: "Integration",
    title: {
      en: "Gmail, Drive, Sheets, Calendar, Slack, GitHub, Notion — and your own database",
      vi: "Gmail, Drive, Sheets, Calendar, Slack, GitHub, Notion — và cơ sở dữ liệu của bạn",
    },
    excerpt: {
      en: "Connect an account once and its tools become selectable on any agent step, with reading and writing as separate permissions.",
      vi: "Kết nối tài khoản một lần và các công cụ của nó trở thành lựa chọn được trên mọi bước agent, với quyền đọc và quyền ghi tách riêng.",
    },
    bullets: {
      en: [
        "Gmail — search a mailbox and send from it",
        "Google Drive, Sheets and Calendar — find a document, read a list, append a row, look at the week ahead",
        "Slack — read channel history and post an answer back into the thread that asked",
        "GitHub — search issues before filing the fifth copy of one, and open a new one when it really is new",
        "Notion — search a workspace live, so an answer reflects today's page",
        "PostgreSQL and MySQL — read-only, on the tables you nominate, with the generated query returned alongside the answer",
      ],
      vi: [
        "Gmail — tìm trong hộp thư và gửi từ chính hộp thư đó",
        "Google Drive, Sheets và Calendar — tìm tài liệu, đọc danh sách, ghi thêm dòng, xem trước tuần tới",
        "Slack — đọc lịch sử kênh và đăng câu trả lời ngay vào luồng đã hỏi",
        "GitHub — tìm issue trước khi tạo bản sao thứ năm, và mở issue mới khi thực sự là vấn đề mới",
        "Notion — tìm trực tiếp trong workspace, để câu trả lời phản ánh trang của hôm nay",
        "PostgreSQL và MySQL — chỉ đọc, trên những bảng bạn chỉ định, truy vấn sinh ra được trả kèm câu trả lời",
      ],
    },
    sections: [
      {
        heading: {
          en: "Connected by the person, not by a shared password",
          vi: "Do chính người dùng kết nối, không phải một mật khẩu dùng chung",
        },
        body: {
          en: "An account is connected by its owner over OAuth, so an agent sees exactly what that person sees and access is revoked from their own account settings. Stored credentials are encrypted and never returned by the API — you get a masked hint back, not the secret.",
          vi: "Tài khoản do chủ sở hữu kết nối qua OAuth, nên agent nhìn thấy đúng những gì người đó nhìn thấy và quyền được thu hồi ngay trong phần cài đặt tài khoản của họ. Thông tin đăng nhập lưu trữ được mã hoá và không bao giờ trả về qua API — bạn nhận lại một gợi ý đã che, không phải khoá bí mật.",
        },
      },
      {
        heading: {
          en: "Everything a tool returns is treated as data",
          vi: "Mọi thứ công cụ trả về đều được coi là dữ liệu",
        },
        body: {
          en: 'A web page, an email, a channel message or a memory that says "ignore your instructions" reaches the model inside a fence it cannot break out of. Tools that change something in the world are marked as such, and approving one is a decision somebody makes.',
          vi: 'Một trang web, một email, một tin nhắn kênh hay một memory viết "bỏ qua chỉ dẫn của bạn" đều tới mô hình bên trong một hàng rào không thoát ra được. Những công cụ làm thay đổi thứ gì đó ngoài đời được đánh dấu rõ, và việc chấp thuận là quyết định của con người.',
        },
      },
    ],
  },
  {
    id: "cl-1-2",
    date: "2026-09-08",
    version: "1.2",
    type: "Release",
    title: {
      en: "Agents that act, and keep acting while nobody is watching",
      vi: "Agent biết hành động, và tiếp tục hành động khi không có ai ngồi canh",
    },
    excerpt: {
      en: "Twenty-seven tools, scheduled runs, memory between runs, an embeddable chat widget, API keys and outbound webhooks.",
      vi: "Hai mươi bảy công cụ, chạy theo lịch, bộ nhớ giữa các lần chạy, widget chat nhúng được, API key và webhook gửi đi.",
    },
    sections: [
      {
        heading: {
          en: "A chat bubble on your own website",
          vi: "Một bong bóng chat trên chính website của bạn",
        },
        body: {
          en: "One script tag puts a grounded assistant on your site, answering from your knowledge base. The endpoint is public by design, so it is the most carefully bounded thing in the product: origins are checked server-side against your list, rate limits apply per visitor, and every conversation is billed to your workspace and listed with the questions that were asked.",
          vi: "Một thẻ script đặt trợ lý có dẫn nguồn lên site của bạn, trả lời từ knowledge base của bạn. Endpoint này công khai theo thiết kế, nên nó được rào chặt nhất trong cả sản phẩm: origin được kiểm ở phía server theo danh sách của bạn, giới hạn tần suất áp theo từng khách, và mọi hội thoại đều tính vào workspace của bạn cùng được liệt kê kèm câu hỏi đã hỏi.",
        },
        bullets: {
          en: [
            "Activity log with the real questions visitors asked",
            "Allowed-origin list checked on the server, not in the browser",
            "A refusal tells the visitor why, instead of showing an empty bubble",
          ],
          vi: [
            "Nhật ký hoạt động với đúng những câu hỏi khách đã hỏi",
            "Danh sách origin được phép, kiểm ở server chứ không phải ở trình duyệt",
            "Khi bị từ chối, khách nhìn thấy lý do thay vì một bong bóng trống",
          ],
        },
      },
      {
        heading: {
          en: "Run without a person present",
          vi: "Chạy khi không có ai ở đó",
        },
        body: {
          en: "Put an agent on a schedule, or start it from a webhook. Mint an API key and call it from your own product — a key carries less authority than the person who created it, and every run records which key started it. Outbound webhooks are signed, retried and logged.",
          vi: "Đặt agent chạy theo lịch, hoặc khởi động nó từ một webhook. Tạo API key và gọi từ sản phẩm của bạn — một key mang quyền hạn thấp hơn người đã tạo ra nó, và mỗi lần chạy đều ghi lại key nào đã khởi động. Webhook gửi đi được ký, có thử lại và có nhật ký.",
        },
      },
      {
        heading: {
          en: "Roles a workspace writes for itself",
          vi: "Vai trò do workspace tự viết",
        },
        body: {
          en: "Permissions are answered per resource rather than guessed from a role name, and a workspace can compose its own roles — without being able to compose one it could not hold itself. Denials no longer name resources the asker was not allowed to know exist.",
          vi: "Quyền được trả lời theo từng tài nguyên chứ không suy đoán từ tên vai trò, và một workspace có thể tự soạn vai trò riêng — nhưng không thể soạn ra vai trò mà chính họ không được giữ. Thông báo từ chối không còn nêu tên những tài nguyên mà người hỏi không được phép biết là có tồn tại.",
        },
      },
    ],
  },
  {
    id: "cl-2026-09-07-fix",
    date: "2026-09-07",
    version: null,
    type: "Fix",
    title: {
      en: "A run that is interrupted resumes without being billed twice",
      vi: "Một lần chạy bị gián đoạn sẽ tiếp tục mà không bị tính tiền hai lần",
    },
    excerpt: {
      en: "Plus a tightened address policy on every outbound call, and an iteration limit a flow cannot run past.",
      vi: "Kèm chính sách địa chỉ chặt hơn cho mọi lời gọi ra ngoài, và một giới hạn vòng lặp mà flow không thể vượt qua.",
    },
    bullets: {
      en: [
        "A run interrupted mid-step resumes from where it stopped, and the work already paid for is not charged again",
        "Outbound requests are checked against private and link-local ranges before the call and again after every redirect — the address that was checked is the address that is dialled",
        "A loop carries a ceiling it cannot exceed, so a flow that misjudges its own exit condition stops instead of spending",
        "Transcription is no longer billed when the provider reports no duration to bill for",
      ],
      vi: [
        "Lần chạy bị gián đoạn giữa chừng sẽ tiếp tục từ chỗ đã dừng, và phần công việc đã trả tiền không bị tính lại",
        "Yêu cầu gửi ra ngoài được kiểm với dải địa chỉ nội bộ và link-local trước khi gọi và kiểm lại sau mỗi lần chuyển hướng — địa chỉ đã kiểm chính là địa chỉ được gọi",
        "Vòng lặp mang theo một trần không thể vượt, nên một flow đánh giá sai điều kiện thoát sẽ dừng thay vì tiêu tiền",
        "Không còn tính tiền chuyển giọng nói khi nhà cung cấp không báo thời lượng để tính",
      ],
    },
  },
  {
    id: "cl-1-1",
    date: "2026-09-07",
    version: "1.1",
    type: "Release",
    title: {
      en: "The agent canvas — an agent you can look at",
      vi: "Agent canvas — một agent bạn nhìn thấy được",
    },
    excerpt: {
      en: "Agents become graphs: seventeen step types, branches, loops, a step that stops and asks a person, and a run you can replay.",
      vi: "Agent trở thành đồ thị: mười bảy loại bước, nhánh rẽ, vòng lặp, một bước biết dừng lại hỏi con người, và một lần chạy xem lại được.",
    },
    sections: [
      {
        heading: {
          en: "A prompt is easy to write and impossible to debug",
          vi: "Một prompt thì dễ viết và không thể gỡ lỗi",
        },
        body: {
          en: "The canvas turns an agent into steps you can see. Ask a model, search the knowledge base, call tools, branch on a category, loop over a list, pause for a human answer — and when something goes wrong, point at the step rather than rewriting the whole instruction.",
          vi: "Canvas biến agent thành những bước bạn nhìn thấy được. Hỏi mô hình, tìm trong knowledge base, gọi công cụ, rẽ nhánh theo phân loại, lặp qua danh sách, dừng lại chờ câu trả lời của người — và khi có gì sai, hãy chỉ vào đúng bước thay vì viết lại toàn bộ chỉ dẫn.",
        },
        bullets: {
          en: [
            "Branches are drawn where they actually go",
            "Problems are named before you can publish, not discovered on a charged run",
            "Every version is kept, and any of them can be restored",
          ],
          vi: [
            "Các nhánh được vẽ đúng nơi chúng dẫn tới",
            "Lỗi được nêu tên trước khi bạn xuất bản, không phải phát hiện ra ở một lần chạy đã mất tiền",
            "Mọi phiên bản đều được giữ, và cái nào cũng khôi phục được",
          ],
        },
      },
      {
        heading: {
          en: "Voice and pictures, in the same conversation",
          vi: "Giọng nói và hình ảnh, trong cùng một hội thoại",
        },
        body: {
          en: "Record a voice note in the composer and it is transcribed before it becomes your question, with the audio still attached to the turn. Attach a screenshot and it reaches a model that can actually see — one that has not declared vision support is not offered for the step.",
          vi: "Ghi âm ngay trong khung soạn và bản ghi được chuyển thành văn bản trước khi trở thành câu hỏi, file âm thanh vẫn đi kèm lượt chat. Đính một ảnh chụp màn hình và nó tới được mô hình thật sự nhìn được — mô hình chưa khai báo hỗ trợ thị giác sẽ không được đề xuất cho bước đó.",
        },
      },
      {
        heading: {
          en: "What a run cost, step by step",
          vi: "Một lần chạy tốn bao nhiêu, theo từng bước",
        },
        body: {
          en: "Each step records what it was given, what it answered, how long it took and what it spent. A tool call that changes something in the world is marked, and approving it is a decision somebody makes rather than a default.",
          vi: "Mỗi bước ghi lại nó nhận gì, trả lời gì, mất bao lâu và tiêu bao nhiêu. Lời gọi công cụ làm thay đổi thứ gì đó ngoài đời được đánh dấu, và việc chấp thuận là quyết định của con người chứ không phải mặc định.",
        },
      },
    ],
  },
  {
    id: "cl-2026-09-06-model",
    date: "2026-09-06",
    version: null,
    type: "Model",
    title: {
      en: "Import a provider's whole price list, and an economy tier that means it",
      vi: "Nhập trọn bảng giá của nhà cung cấp, và một hạng economy đúng nghĩa",
    },
    excerpt: {
      en: "Add a provider key and pull its catalogue in one press — with prices frozen at the moment they were used.",
      vi: "Thêm khoá của nhà cung cấp và kéo về toàn bộ danh mục chỉ bằng một lần bấm — với giá được đóng băng tại thời điểm sử dụng.",
    },
    bullets: {
      en: [
        "Importing a provider's models brings their published prices with them, and a model you disabled stays disabled across a re-import",
        "Usage is priced at the rate in force when it ran: raising a price later never re-prices last month",
        "The economy tier now means what the name says — a model is economy only if it is genuinely cheap, not merely small",
        "Per-plan model access, so the free tier is scoped to models a free tier can afford",
      ],
      vi: [
        "Nhập mô hình của nhà cung cấp sẽ mang theo bảng giá công bố của họ, và một mô hình bạn đã tắt vẫn tắt sau khi nhập lại",
        "Mức dùng được tính theo giá tại thời điểm chạy: tăng giá về sau không bao giờ tính lại tháng trước",
        "Hạng economy giờ đúng như tên gọi — một mô hình chỉ là economy nếu nó thật sự rẻ, chứ không phải chỉ vì nó nhỏ",
        "Phân quyền mô hình theo gói, để gói miễn phí chỉ dùng những mô hình mà một gói miễn phí kham được",
      ],
    },
  },
  {
    id: "cl-1-0",
    date: "2026-09-05",
    version: "1.0",
    type: "Release",
    title: {
      en: "Ragenta is live: grounded chat on your own knowledge",
      vi: "Ragenta đã hoạt động: chat có dẫn nguồn trên chính tri thức của bạn",
    },
    excerpt: {
      en: "Workspaces, knowledge bases, hybrid retrieval with reranking, and answers that carry the passage they came from.",
      vi: "Workspace, knowledge base, truy hồi lai có rerank, và những câu trả lời mang theo đoạn văn mà chúng lấy ra.",
    },
    sections: [
      {
        heading: {
          en: "Upload, and ask",
          vi: "Tải lên, rồi hỏi",
        },
        body: {
          en: "Connect or upload your documents and Ragenta parses the layout, chunks on structure rather than character count, embeds into one multilingual vector space and keeps the result searchable. Scanned pages go through OCR; tables stay tables.",
          vi: "Kết nối hoặc tải tài liệu lên, Ragenta bóc tách bố cục, cắt theo cấu trúc thay vì đếm ký tự, nhúng vào một không gian vector đa ngôn ngữ và giữ kết quả ở trạng thái tìm kiếm được. Trang scan đi qua OCR; bảng vẫn là bảng.",
        },
        bullets: {
          en: [
            "Vector and keyword search run together, then a reranker decides what reaches the model",
            "Every answer shows the passages behind it, and which ones fell below the cut",
            "Vietnamese and English share one index — a question in either finds documents in both",
          ],
          vi: [
            "Tìm kiếm vector và tìm theo từ khoá chạy song song, rồi reranker quyết định cái gì tới được mô hình",
            "Mỗi câu trả lời đều hiện các đoạn đứng sau nó, và những đoạn nào đã rớt dưới ngưỡng",
            "Tiếng Việt và tiếng Anh dùng chung một index — hỏi bằng thứ tiếng nào cũng tìm được tài liệu của cả hai",
          ],
        },
      },
      {
        heading: {
          en: "Workspaces, projects and people",
          vi: "Workspace, dự án và con người",
        },
        body: {
          en: "A workspace owns its knowledge, its members and its balance. Invite people, put them on projects, and see what each of them is spending.",
          vi: "Một workspace sở hữu tri thức, thành viên và số dư của chính nó. Mời người vào, xếp họ vào dự án, và xem từng người đang tiêu bao nhiêu.",
        },
      },
      {
        heading: {
          en: "Usage you can read",
          vi: "Mức sử dụng đọc được",
        },
        body: {
          en: "Consumption is a ledger, not a counter that can be edited. Every model call is recorded with the model, the tokens and the price in force at the time, and the usage screen adds it up by day, by member and by model.",
          vi: "Mức tiêu thụ là một sổ cái, không phải một bộ đếm có thể sửa. Mỗi lời gọi mô hình đều được ghi kèm tên mô hình, số token và mức giá tại thời điểm đó, và màn hình sử dụng cộng lại theo ngày, theo thành viên và theo mô hình.",
        },
      },
    ],
  },
];
