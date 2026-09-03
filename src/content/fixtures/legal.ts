import type { Locale } from "@/i18n/config";
import type { LegalDocument } from "@/content/types";

/**
 * Fixture behind `GET /v1/public/legal/:slug`. Vecura fetches these from
 * Confluence; Ragenta keeps them in the repo until a source of record exists.
 *
 * Not counsel-reviewed. That is a known and accepted state, not an oversight —
 * see .claude/docs/STATE.md. Edit the bodies here; when the content backend
 * lands they move to GET /v1/public/legal/:slug with no code change.
 */
const PRIVACY_EN = `## 1. Who we are

Ragenta ("we", "us") provides a hosted platform for building retrieval-augmented
chat and AI agents over your own documents and data sources. This policy
explains what we collect on this marketing website and what we do with it.

## 2. What this policy covers

This policy covers **ragenta.cloud** and its subdomains. Data you upload into the
Ragenta application is governed by your service agreement and our Data
Processing Addendum, not by this page.

## 3. Information we collect

| Category | Examples | Why |
| --- | --- | --- |
| Contact details | Name, work email, company, role | To answer a demo or sales request |
| Usage data | Pages visited, referrer, campaign parameters | To understand which content is useful |
| Device data | Browser, operating system, approximate region | To keep the site working and secure |

We do not collect special-category personal data through this website, and we
ask you not to include it in a contact-form message.

## 4. How we use it

- To respond to enquiries you send us.
- To send product updates you have asked to receive.
- To measure which pages and campaigns bring people to the site.
- To detect and prevent abuse.

## 5. Legal bases

Where the GDPR applies, we rely on **legitimate interests** for site analytics
and security, **consent** for marketing email, and **contract** for
communications about a service you are evaluating or using.

## 6. Sharing

We share personal data only with processors acting on our instructions —
hosting, analytics and email delivery — and where we are legally required to.
We do not sell personal data.

## 7. Retention

Contact-form submissions are kept for 24 months from the last interaction.
Analytics data is retained in aggregated form.

## 8. Your rights

You may request access, correction, deletion, restriction or portability of
your personal data, and you may object to processing based on legitimate
interests. Write to privacy@ragenta.cloud and we will respond within 30 days.

## 9. International transfers

Where personal data leaves your region, we rely on Standard Contractual Clauses
or an equivalent transfer mechanism.

## 10. Changes

We will post any change on this page and update the date below. Material
changes will also be announced in the product.

## 11. Contact

privacy@ragenta.cloud
`;

const PRIVACY_VI = `## 1. Chúng tôi là ai

Ragenta ("chúng tôi") cung cấp nền tảng đám mây để xây dựng chat truy hồi tăng
cường (RAG) và AI agent trên chính tài liệu và nguồn dữ liệu của bạn. Chính
sách này giải thích chúng tôi thu thập gì trên website giới thiệu này và dùng
vào việc gì.

## 2. Phạm vi áp dụng

Chính sách này áp dụng cho **ragenta.cloud** và các tên miền phụ. Dữ liệu bạn tải
lên ứng dụng Ragenta chịu sự điều chỉnh của hợp đồng dịch vụ và Phụ lục Xử lý
Dữ liệu, không phải trang này.

## 3. Thông tin chúng tôi thu thập

| Nhóm | Ví dụ | Mục đích |
| --- | --- | --- |
| Thông tin liên hệ | Họ tên, email công việc, công ty, chức danh | Phản hồi yêu cầu demo hoặc tư vấn |
| Dữ liệu sử dụng | Trang đã xem, nguồn giới thiệu, tham số chiến dịch | Hiểu nội dung nào thực sự hữu ích |
| Dữ liệu thiết bị | Trình duyệt, hệ điều hành, khu vực tương đối | Duy trì hoạt động và bảo mật của trang |

Chúng tôi không thu thập dữ liệu cá nhân thuộc nhóm nhạy cảm qua website này,
và đề nghị bạn không đưa loại dữ liệu đó vào nội dung biểu mẫu liên hệ.

## 4. Chúng tôi dùng dữ liệu để làm gì

- Phản hồi các yêu cầu bạn gửi tới.
- Gửi cập nhật sản phẩm mà bạn đã đăng ký nhận.
- Đo lường trang và chiến dịch nào đưa người dùng đến website.
- Phát hiện và ngăn chặn hành vi lạm dụng.

## 5. Cơ sở pháp lý

Trong phạm vi GDPR áp dụng, chúng tôi dựa trên **lợi ích hợp pháp** cho phân
tích và bảo mật website, **sự đồng ý** cho email tiếp thị, và **hợp đồng** cho
các trao đổi liên quan tới dịch vụ bạn đang dùng thử hoặc sử dụng.

## 6. Chia sẻ dữ liệu

Chúng tôi chỉ chia sẻ dữ liệu cá nhân với các bên xử lý theo chỉ dẫn của chúng
tôi — hạ tầng lưu trữ, phân tích và gửi email — hoặc khi pháp luật yêu cầu.
Chúng tôi không bán dữ liệu cá nhân.

## 7. Thời gian lưu trữ

Nội dung gửi qua biểu mẫu liên hệ được lưu 24 tháng kể từ lần tương tác cuối.
Dữ liệu phân tích được lưu ở dạng tổng hợp.

## 8. Quyền của bạn

Bạn có quyền yêu cầu truy cập, chỉnh sửa, xoá, hạn chế hoặc chuyển dữ liệu cá
nhân của mình, và có quyền phản đối việc xử lý dựa trên lợi ích hợp pháp. Vui
lòng gửi thư tới privacy@ragenta.cloud, chúng tôi phản hồi trong vòng 30 ngày.

## 9. Chuyển dữ liệu quốc tế

Khi dữ liệu cá nhân rời khỏi khu vực của bạn, chúng tôi áp dụng Điều khoản Hợp
đồng Tiêu chuẩn hoặc cơ chế chuyển dữ liệu tương đương.

## 10. Thay đổi

Mọi thay đổi sẽ được đăng trên trang này kèm cập nhật ngày bên dưới. Thay đổi
trọng yếu sẽ được thông báo thêm trong sản phẩm.

## 11. Liên hệ

privacy@ragenta.cloud
`;

const TERMS_EN = `## 1. Agreement

These terms govern your use of the Ragenta website and, where you do not have a
separate signed agreement, the Ragenta service. By creating an account or using
the service you accept them.

## 2. The service

Ragenta provides hosted retrieval-augmented chat and AI agents over content you
connect. Features evolve; we may add, change or withdraw functionality, and we
will give reasonable notice before removing something you depend on.

## 3. Your account

You are responsible for the accuracy of your registration details, for
activity under your account, and for keeping credentials and API keys secret.
Tell us promptly at security@ragenta.cloud if you believe an account is compromised.

## 4. Your content

You keep all rights in the documents, data and prompts you bring to Ragenta.
You grant us the limited licence needed to host, index, process and return that
content in order to operate the service for you. We do not use your content to
train foundation models.

## 5. Acceptable use

You may not use Ragenta to:

- upload content you have no right to use;
- attempt to identify individuals from data in a way the source did not permit;
- probe, scan or overload the service, or bypass usage limits;
- generate material that is unlawful, or that impersonates a person or
  organisation in a deceptive way.

## 6. Plans, credits and payment

Paid plans are billed in advance for the period you select. Usage is metered in
credits, and a plan's included credits reset at the start of each billing
period unless stated otherwise. Fees are exclusive of taxes.

## 7. AI output

Model output can be wrong. Ragenta grounds answers in the sources you connect
and attaches citations, but you remain responsible for reviewing output before
relying on it for a decision with legal, financial, medical or safety
consequences.

## 8. Availability

We aim for high availability but do not guarantee uninterrupted service on
plans without a written service-level agreement.

## 9. Termination

You may stop using the service at any time. We may suspend an account that
breaches these terms, and will tell you why unless prevented by law. On
termination we delete or return your content in line with the retention terms
of your plan.

## 10. Liability

To the extent permitted by law, neither party is liable for indirect or
consequential loss. Our aggregate liability is capped at the fees you paid in
the twelve months before the claim.

## 11. Changes

We will post changes here and, for material changes, notify account owners at
least 30 days before they take effect.

## 12. Contact

legal@ragenta.cloud
`;

const TERMS_VI = `## 1. Thoả thuận

Các điều khoản này điều chỉnh việc bạn sử dụng website Ragenta và, trong trường
hợp không có hợp đồng ký riêng, cả dịch vụ Ragenta. Việc tạo tài khoản hoặc sử
dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các điều khoản này.

## 2. Về dịch vụ

Ragenta cung cấp dịch vụ chat truy hồi tăng cường và AI agent trên nội dung bạn
kết nối. Tính năng sẽ thay đổi theo thời gian; chúng tôi có thể bổ sung, điều
chỉnh hoặc ngừng cung cấp một tính năng, và sẽ thông báo trong thời hạn hợp lý
trước khi gỡ bỏ tính năng mà bạn đang phụ thuộc.

## 3. Tài khoản của bạn

Bạn chịu trách nhiệm về tính chính xác của thông tin đăng ký, về mọi hoạt động
dưới tài khoản của mình, và về việc giữ bí mật thông tin đăng nhập cùng khoá
API. Hãy báo ngay tới security@ragenta.cloud nếu bạn cho rằng tài khoản bị xâm phạm.

## 4. Nội dung của bạn

Bạn giữ toàn bộ quyền đối với tài liệu, dữ liệu và prompt mà bạn đưa vào
Ragenta. Bạn cấp cho chúng tôi giấy phép giới hạn cần thiết để lưu trữ, đánh
chỉ mục, xử lý và trả về nội dung đó nhằm vận hành dịch vụ cho bạn. Chúng tôi
không dùng nội dung của bạn để huấn luyện mô hình nền.

## 5. Sử dụng hợp lệ

Bạn không được dùng Ragenta để:

- tải lên nội dung mà bạn không có quyền sử dụng;
- cố gắng định danh cá nhân từ dữ liệu theo cách nguồn dữ liệu không cho phép;
- dò quét, tấn công, gây quá tải dịch vụ hoặc lách các giới hạn sử dụng;
- tạo ra nội dung trái pháp luật, hoặc giả mạo một cá nhân, tổ chức nhằm gây
  nhầm lẫn.

## 6. Gói dịch vụ, credit và thanh toán

Các gói trả phí được thanh toán trước cho kỳ bạn chọn. Mức sử dụng được tính
theo credit, và credit đi kèm gói sẽ đặt lại vào đầu mỗi kỳ thanh toán trừ khi
có thoả thuận khác. Phí chưa bao gồm thuế.

## 7. Kết quả do AI tạo ra

Kết quả của mô hình có thể sai. Ragenta neo câu trả lời vào các nguồn bạn kết
nối và kèm trích dẫn, nhưng bạn vẫn chịu trách nhiệm rà soát kết quả trước khi
dùng nó cho quyết định có hệ quả pháp lý, tài chính, y tế hoặc an toàn.

## 8. Mức độ sẵn sàng

Chúng tôi hướng tới mức sẵn sàng cao nhưng không cam kết dịch vụ không gián
đoạn đối với các gói không có thoả thuận mức dịch vụ bằng văn bản.

## 9. Chấm dứt

Bạn có thể ngừng sử dụng dịch vụ bất cứ lúc nào. Chúng tôi có thể tạm ngưng tài
khoản vi phạm các điều khoản này và sẽ nêu lý do, trừ khi pháp luật không cho
phép. Khi chấm dứt, chúng tôi xoá hoặc hoàn trả nội dung của bạn theo điều
khoản lưu trữ của gói dịch vụ.

## 10. Giới hạn trách nhiệm

Trong phạm vi pháp luật cho phép, không bên nào chịu trách nhiệm cho thiệt hại
gián tiếp hoặc phái sinh. Tổng trách nhiệm của chúng tôi giới hạn ở mức phí bạn
đã thanh toán trong mười hai tháng trước thời điểm phát sinh khiếu nại.

## 11. Thay đổi

Chúng tôi đăng các thay đổi tại đây và, với thay đổi trọng yếu, thông báo cho
chủ tài khoản ít nhất 30 ngày trước khi có hiệu lực.

## 12. Liên hệ

legal@ragenta.cloud
`;

export const LEGAL_SEED: Record<
  LegalDocument["slug"],
  Record<Locale, LegalDocument>
> = {
  "privacy-policy": {
    en: {
      slug: "privacy-policy",
      title: "Privacy Policy",
      updatedAt: "2026-08-01",
      bodyMd: PRIVACY_EN,
    },
    vi: {
      slug: "privacy-policy",
      title: "Chính sách quyền riêng tư",
      updatedAt: "2026-08-01",
      bodyMd: PRIVACY_VI,
    },
  },
  "terms-of-service": {
    en: {
      slug: "terms-of-service",
      title: "Terms of Service",
      updatedAt: "2026-08-01",
      bodyMd: TERMS_EN,
    },
    vi: {
      slug: "terms-of-service",
      title: "Điều khoản dịch vụ",
      updatedAt: "2026-08-01",
      bodyMd: TERMS_VI,
    },
  },
};
