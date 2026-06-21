import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Ban,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  FileWarning,
  Flag,
  Hash,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  Trash2,
  TrendingUp,
  UserCog,
  Users,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  addAdminTaxonomy,
  getAdminState,
  removeAdminTaxonomy,
  updateAdminCollection
} from "../../../services/admin.service.js";
import "./AdminPages.css";

function useAdminState() {
  const [state, setState] = useState(() => getAdminState());
  useEffect(() => {
    const refresh = (event) => setState(event.detail || getAdminState());
    window.addEventListener("chillplace:admin-updated", refresh);
    return () => window.removeEventListener("chillplace:admin-updated", refresh);
  }, []);
  return state;
}

function PageHeader({ eyebrow, title, description, actions }) {
  return <header className="admin-page-header"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{actions ? <div className="admin-page-header__actions">{actions}</div> : null}</header>;
}

function Metric({ icon: Icon, label, value, note, tone = "orange" }) {
  return <article className={`admin-metric admin-metric--${tone}`}><span><Icon size={18} /></span><div><small>{label}</small><strong>{value}</strong></div>{note ? <em>{note}</em> : null}</article>;
}

function Status({ value }) {
  const labels = { active: "Hoạt động", suspended: "Bị đình chỉ", pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối", resolved: "Đã xử lý" };
  return <span className={`admin-status admin-status--${value}`}><i />{labels[value] || value}</span>;
}

function Toast({ children }) {
  return children ? <div className="admin-toast" role="status"><CheckCircle2 size={16} />{children}</div> : null;
}

function Sparkline({ values, label, value, tone = "orange" }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((item, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 38 - ((item - min) / Math.max(1, max - min)) * 30;
    return `${x},${y}`;
  }).join(" ");
  return <div className={`admin-sparkline admin-sparkline--${tone}`}><header><div><span>{label}</span><strong>{value}</strong></div><TrendingUp size={17} aria-hidden="true" /></header><svg viewBox="0 0 100 42" preserveAspectRatio="none" role="img" aria-label={`Biểu đồ ${label}: ${value}`}><defs><linearGradient id={`spark-${tone}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".28"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><polygon points={`0,42 ${points} 100,42`} fill={`url(#spark-${tone})`} /><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.4" vectorEffect="non-scaling-stroke" /></svg></div>;
}

function DonutChart({ value, label, caption, tone = "orange", legend = [] }) {
  return <div className={`admin-donut-card admin-donut-card--${tone}`} role="img" aria-label={`${caption}: ${value}% ${label}`}><div className="admin-donut" style={{ "--donut-value": `${value * 3.6}deg` }}><div><strong>{value}%</strong><span>{label}</span></div></div><div className="admin-donut-copy"><small>{caption}</small>{legend.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}<b>{item.value}</b></span>)}</div></div>;
}

function BarBreakdown({ title, subtitle, items }) {
  return <article className="admin-viz-card" aria-label={`${title}: ${items.map(item => `${item.label} ${item.value}%`).join(", ")}`}><header><div><span>{subtitle}</span><h2>{title}</h2></div><BarChart3 size={18} aria-hidden="true" /></header><div className="admin-horizontal-bars">{items.map((item) => <div key={item.label}><span>{item.label}<b>{item.value}%</b></span><i><em style={{ width: `${item.value}%`, background: item.color }} /></i></div>)}</div></article>;
}

function ActivityHeatmap({ title = "Mật độ hoạt động", values = [2,4,3,7,8,4,5,9,6,3,8,7,5,9,4,6,8,5,3,7,9,6,4,8] }) {
  return <article className="admin-viz-card admin-heatmap"><header><div><span>24 GIỜ GẦN NHẤT</span><h2>{title}</h2></div><Activity size={18} /></header><div>{values.map((value,index) => <i key={index} style={{ "--heat": value / 10 }} title={`${index}:00 · mức ${value}`} />)}</div><footer><span>00:00</span><span>12:00</span><span>23:00</span></footer></article>;
}

function FunnelChart({ steps }) {
  return <article className="admin-viz-card admin-funnel"><header><div><span>CHUYỂN ĐỔI QUY TRÌNH</span><h2>Luồng xử lý</h2></div><ShieldCheck size={18} /></header><div>{steps.map((step,index) => <span key={step.label} style={{ width: `${100 - index * 14}%` }}><b>{step.value}</b>{step.label}</span>)}</div></article>;
}

export function AdminDashboardPage() {
  const state = useAdminState();
  const pending = state.reports.filter((item) => item.status === "pending").length;
  return <section className="admin-page">
    <PageHeader eyebrow="System Control" title="Tổng quan hệ thống" description="Theo dõi sức khỏe nền tảng và các tác vụ quản trị cần ưu tiên hôm nay." actions={<><button className="admin-button admin-button--soft">7 ngày qua</button><button className="admin-button">Tải báo cáo PDF</button></>} />
    <div className="admin-metric-grid">
      <Metric icon={Users} label="Tổng người dùng" value="24,512" note="+12%" />
      <Metric icon={MapPin} label="Địa điểm hoạt động" value="1,284" note="+5.4%" tone="teal" />
      <Metric icon={FileWarning} label="Báo cáo chờ duyệt" value={pending} note="Cần xử lý" tone="red" />
      <Metric icon={CircleDollarSign} label="Doanh thu tháng" value="$92.4k" note="+21%" tone="blue" />
    </div>
    <div className="admin-overview-rail"><Sparkline label="Người dùng hoạt động" value="18.4k" values={[42,50,47,61,58,76,82,79,94]} /><Sparkline label="Tương tác nội dung" value="+28.6%" values={[24,35,32,48,44,59,71,66,84]} tone="teal" /><DonutChart value={99.9} label="Uptime" caption="Hệ thống ổn định" tone="teal" /></div>
    <div className="admin-dashboard-grid">
      <article className="admin-panel admin-chart-panel"><div className="admin-panel__head"><div><span>HIỆU SUẤT 7 NGÀY</span><h2>Xu hướng tăng trưởng</h2><p>Người dùng mới và địa điểm được duyệt.</p></div><BarChart3 /></div><div className="admin-bars" aria-label="Biểu đồ tăng trưởng">{[42,55,48,68,84,59,92].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><b style={{ height: `${Math.max(24, height - 22)}%` }} /><span>{["T2","T3","T4","T5","T6","T7","CN"][index]}</span></div>)}</div></article>
      <aside className="admin-dashboard-side"><article className="admin-panel admin-health"><div className="admin-panel__head"><div><span>TRẠNG THÁI</span><h2>Sức khỏe hệ thống</h2></div><Activity /></div>{[["Tải CPU",24],["Bộ nhớ RAM",62],["Độ trễ API",38]].map(([label,value]) => <div className="admin-health__row" key={label}><span>{label}<b>{value}%</b></span><i><em style={{ width: `${value}%` }} /></i></div>)}</article><article className="admin-panel"><div className="admin-panel__head"><div><span>THAO TÁC NHANH</span><h2>Điều phối</h2></div><Sparkles /></div><div className="admin-quick-actions"><Link to="/admin/users"><UserCog />Mở Admin</Link><Link to="/admin/reports"><Database />Sao lưu DB</Link></div></article></aside>
    </div>
    <article className="admin-panel admin-activity"><div className="admin-panel__head"><div><span>NHẬT KÝ</span><h2>Hoạt động điều phối gần đây</h2></div><Link to="/admin/reports">Xem tất cả <ChevronRight size={15} /></Link></div>{state.reports.slice(0,3).map((item, index) => <div className="admin-activity__row" key={item.id}><span>{["LM","HA","TA"][index]}</span><div><strong>{["Lê Minh","Hoàng Anh","Trần Anh"][index]}</strong><small>{item.reason}</small></div><p>{item.title}</p><time>{index + 11}:2{index}, Hôm nay</time><Status value={item.status === "pending" ? "pending" : "resolved"} /></div>)}</article>
  </section>;
}

export function AdminUsersPage() {
  const state = useAdminState();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [role, setRole] = useState("all");
  const [toast, setToast] = useState("");
  const users = state.users.filter((user) => (role === "all" || user.role.toLowerCase() === role) && `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  function toggleUser(user) { updateAdminCollection("users", user.id, { status: user.status === "active" ? "suspended" : "active" }); setToast(`Đã cập nhật ${user.name}`); }
  return <section className="admin-page"><PageHeader eyebrow="People & Access" title="Quản lý người dùng" description="Tìm kiếm, phân quyền và kiểm soát trạng thái tài khoản." actions={<button className="admin-button"><Plus size={16} />Thêm người dùng</button>} />
    <div className="admin-metric-grid admin-metric-grid--three"><Metric icon={Users} label="Tổng người dùng" value="24,512" note="+12%" tone="blue" /><Metric icon={Star} label="Nhà sáng tạo" value="1,204" note="+5%" /><Metric icon={Building2} label="Doanh nghiệp" value="856" note="Ổn định" tone="teal" /></div>
    <div className="admin-visual-grid admin-visual-grid--users"><DonutChart value={65} label="User" caption="Phân bổ tài khoản" legend={[{label:"Người dùng",value:"65%",color:"var(--color-primary)"},{label:"Creator",value:"25%",color:"var(--color-secondary)"},{label:"Business",value:"10%",color:"var(--color-accent)"}]} /><Sparkline label="Đăng ký mới" value="1,842" values={[24,31,29,44,52,49,67,72,88,94]} tone="blue" /><BarBreakdown title="Chất lượng hồ sơ" subtitle="MỨC HOÀN THIỆN" items={[{label:"Đầy đủ",value:72,color:"var(--color-accent)"},{label:"Cần bổ sung",value:21,color:"var(--color-warning)"},{label:"Rủi ro",value:7,color:"var(--color-danger)"}]} /></div>
    <div className="admin-toolbar"><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên hoặc email..." /></label><div>{[["all","Tất cả"],["user","Người dùng"],["creator","Creator"],["business","Doanh nghiệp"]].map(([value,label]) => <button className={role === value ? "is-active" : ""} key={value} onClick={() => setRole(value)}>{label}</button>)}</div></div>
    <article className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Người dùng</th><th>Vai trò</th><th>Trạng thái</th><th>Ngày đăng ký</th><th>Thao tác</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><div className="admin-user-cell"><span>{user.initials}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td><span className="admin-role">{user.role}</span></td><td><Status value={user.status} /></td><td>{user.joined}</td><td><button className="admin-icon-action" onClick={() => toggleUser(user)} aria-label="Đổi trạng thái">{user.status === "active" ? <Ban size={16} /> : <Check size={16} />}</button></td></tr>)}</tbody></table>{!users.length ? <div className="admin-empty">Không tìm thấy người dùng phù hợp.</div> : null}</article><Toast>{toast}</Toast>
  </section>;
}

export function AdminPlacesPage() {
  const state = useAdminState(); const [filter, setFilter] = useState("all"); const [toast, setToast] = useState("");
  const places = state.places.filter((place) => filter === "all" || place.status === filter);
  const act = (place, status) => { updateAdminCollection("places", place.id, { status }); setToast(`${place.name}: ${status === "approved" ? "đã duyệt" : "đã từ chối"}`); };
  return <section className="admin-page"><PageHeader eyebrow="Place Governance" title="Quản lý địa điểm" description="Kiểm duyệt hồ sơ địa điểm và chất lượng dữ liệu công khai." />
    <div className="admin-metric-grid"><Metric icon={MapPin} label="Tổng cộng" value="1,284" /><Metric icon={Clock3} label="Chờ duyệt" value={state.places.filter(p => p.status === "pending").length} tone="red" /><Metric icon={BadgeCheck} label="Đã duyệt" value="1,210" tone="teal" /><Metric icon={Trash2} label="Bị gỡ" value="32" tone="blue" /></div>
    <div className="admin-visual-grid"><FunnelChart steps={[{label:"Hồ sơ gửi lên",value:"186"},{label:"Đã xác minh",value:"142"},{label:"Được duyệt",value:"118"},{label:"Đang hoạt động",value:"104"}]} /><BarBreakdown title="Phân bổ theo khu vực" subtitle="TOP THÀNH PHỐ" items={[{label:"TP.HCM",value:86,color:"var(--color-primary)"},{label:"Hà Nội",value:68,color:"var(--color-secondary)"},{label:"Đà Nẵng",value:44,color:"var(--color-accent)"},{label:"Đà Lạt",value:31,color:"var(--color-warning)"}]} /><Sparkline label="Địa điểm mới" value="+14.2%" values={[20,28,26,39,45,42,57,61,74]} tone="teal" /></div>
    <div className="admin-segmented">{[["all","Tất cả"],["pending","Chờ duyệt"],["approved","Đã duyệt"]].map(([value,label]) => <button className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)} key={value}>{label}</button>)}</div>
    <div className="admin-place-grid">{places.map(place => <article className="admin-place-card" key={place.id}><div className="admin-place-card__media"><img src={place.image} alt="" /><Status value={place.status} /><button aria-label="Đánh dấu"><Star size={17} /></button></div><div className="admin-place-card__body"><div><h2>{place.name}</h2><strong><Star size={13} />{place.rating}</strong></div><p><MapPin size={14} />{place.area}</p><footer>{place.status === "pending" ? <><button onClick={() => act(place,"approved")}><CheckCircle2 size={16} />Phê duyệt</button><button onClick={() => act(place,"rejected")}><Ban size={16} />Từ chối</button></> : <><button className="admin-button--soft">Sửa</button><button onClick={() => act(place,"rejected")}><Trash2 size={15} />Gỡ bỏ</button></>}</footer></div></article>)}</div><Toast>{toast}</Toast>
  </section>;
}

export function AdminPostsPage() {
  const state = useAdminState(); const [filter, setFilter] = useState("pending"); const [toast, setToast] = useState("");
  const reports = state.reports.filter(item => filter === "all" || item.status === filter);
  const act = (item, status) => { updateAdminCollection("reports", item.id, { status }); setToast(`Đã ${status === "approved" ? "phê duyệt" : status === "rejected" ? "gỡ bỏ" : "cảnh cáo"} nội dung`); };
  return <section className="admin-page"><PageHeader eyebrow="Moderation / Content Queue" title="Kiểm duyệt nội dung" description="Xử lý nội dung được cộng đồng và hệ thống phát hiện." actions={<div className="admin-segmented admin-segmented--compact">{[["pending","Đang chờ"],["approved","Đã giải quyết"],["all","Tất cả"]].map(([v,l]) => <button className={filter === v ? "is-active" : ""} onClick={() => setFilter(v)} key={v}>{l}</button>)}</div>} />
    <div className="admin-visual-grid admin-visual-grid--moderation"><DonutChart value={74} label="Tự động" caption="Nguồn phát hiện" tone="red" legend={[{label:"AI phát hiện",value:"74%",color:"var(--color-danger)"},{label:"Cộng đồng",value:"26%",color:"var(--color-secondary)"}]} /><ActivityHeatmap title="Báo cáo theo giờ" /><BarBreakdown title="Nhóm vi phạm" subtitle="RISK COMPOSITION" items={[{label:"Spam",value:76,color:"var(--color-secondary)"},{label:"Phản cảm",value:58,color:"var(--color-primary)"},{label:"Bạo lực",value:34,color:"var(--color-danger)"}]} /></div>
    <div className="admin-toolbar"><div><button>Lý do: Tất cả</button><button>Loại: Bài viết & đánh giá</button><button>Ưu tiên: Cao nhất</button></div><span><i />24 báo cáo mới trong 1 giờ qua</span></div>
    <div className="admin-moderation-grid">{reports.map(item => <article className="admin-moderation-card" key={item.id}><div className="admin-moderation-card__body"><img src={item.image} alt="" /><div><span>{item.reason}</span><h2>{item.title}</h2><small>Đăng bởi <b>{item.author}</b></small><p>{item.excerpt}</p></div><em className={`priority priority--${item.priority}`}>{item.priority}</em></div><footer><button onClick={() => act(item,"approved")}><CheckCircle2 size={16} />Phê duyệt</button><button onClick={() => act(item,"rejected")}><Trash2 size={16} />Gỡ bỏ</button><button className="admin-button--soft" onClick={() => act(item,"resolved")}><AlertTriangle size={16} />Cảnh cáo</button></footer></article>)}</div>{!reports.length ? <div className="admin-empty"><ShieldCheck size={34} /><strong>Tuyệt vời!</strong><p>Không còn nội dung nào trong hàng đợi này.</p></div> : null}<Toast>{toast}</Toast>
  </section>;
}

export function AdminReportsPage() {
  const state = useAdminState(); const [tab, setTab] = useState("pending"); const [toast, setToast] = useState("");
  const items = state.reports.filter(item => tab === "all" || item.status === tab);
  function resolve(item) { updateAdminCollection("reports", item.id, { status: "resolved" }); setToast(`Đã đóng báo cáo ${item.id.toUpperCase()}`); }
  return <section className="admin-page"><PageHeader eyebrow="Safety Center" title="Hàng đợi báo cáo" description="Điều tra, phân loại và lưu vết toàn bộ báo cáo vi phạm." actions={<button className="admin-button"><Flag size={16} />Xuất biên bản</button>} />
    <div className="admin-metric-grid admin-metric-grid--three"><Metric icon={FileWarning} label="Đang chờ" value={state.reports.filter(i => i.status === "pending").length} tone="red" /><Metric icon={CheckCircle2} label="Đã xử lý hôm nay" value="48" tone="teal" /><Metric icon={TrendingUp} label="Thời gian trung bình" value="18 phút" tone="blue" /></div>
    <div className="admin-visual-grid"><Sparkline label="Tốc độ xử lý" value="-6.4 phút" values={[92,84,87,72,68,61,55,48,42]} tone="teal" /><DonutChart value={92} label="Đúng SLA" caption="Mục tiêu phản hồi" tone="blue" legend={[{label:"Trong 30 phút",value:"92%",color:"var(--color-secondary)"},{label:"Quá hạn",value:"8%",color:"var(--color-danger)"}]} /><BarBreakdown title="Mức độ ưu tiên" subtitle="BÁO CÁO TUẦN NÀY" items={[{label:"Khẩn cấp",value:28,color:"var(--color-danger)"},{label:"Cao",value:64,color:"var(--color-primary)"},{label:"Trung bình",value:82,color:"var(--color-warning)"}]} /></div>
    <div className="admin-segmented">{[["pending","Đang chờ"],["resolved","Đã xử lý"],["all","Tất cả"]].map(([v,l]) => <button className={tab === v ? "is-active" : ""} onClick={() => setTab(v)} key={v}>{l}</button>)}</div>
    <div className="admin-report-list">{items.map(item => <article className="admin-report-row" key={item.id}><span className={`priority-dot priority-dot--${item.priority}`} /><div><strong>{item.title}</strong><small>{item.type} · {item.author}</small></div><span>{item.reason}</span><Status value={item.status} /><button onClick={() => resolve(item)} disabled={item.status === "resolved"}>{item.status === "resolved" ? "Đã đóng" : "Xử lý"}</button></article>)}</div><Toast>{toast}</Toast>
  </section>;
}

export function AdminRoleRequestsPage() {
  const state = useAdminState(); const [selected, setSelected] = useState(state.roleRequests[0]?.id); const [toast,setToast] = useState("");
  const current = state.roleRequests.find(item => item.id === selected);
  const act = (status) => { if (!current) return; updateAdminCollection("roleRequests", current.id, { status }); setToast(`Yêu cầu đã được ${status === "approved" ? "phê duyệt" : "từ chối"}`); };
  return <section className="admin-page"><PageHeader eyebrow="Access Governance" title="Duyệt yêu cầu nâng cấp quyền" description="Xác minh Creator và Business trước khi cấp quyền mở rộng." />
    <div className="admin-visual-grid admin-visual-grid--roles"><FunnelChart steps={[{label:"Yêu cầu mới",value:"128"},{label:"Qua xác minh",value:"94"},{label:"Đủ điều kiện",value:"71"},{label:"Được cấp quyền",value:"62"}]} /><DonutChart value={87} label="Tin cậy" caption="Điểm xác minh trung bình" tone="teal" /><Sparkline label="Tỷ lệ phê duyệt" value="68.4%" values={[58,62,60,66,64,71,69,74,78]} tone="blue" /></div>
    <div className="admin-role-layout"><div className="admin-request-list">{state.roleRequests.map(item => <button className={selected === item.id ? "is-active" : ""} onClick={() => setSelected(item.id)} key={item.id}><span>{item.name.slice(0,2).toUpperCase()}</span><div><strong>{item.name}</strong><small>{item.targetRole} · {item.date}</small></div><Status value={item.status} /><ChevronRight size={16} /></button>)}</div>{current ? <article className="admin-panel admin-request-detail"><div className="admin-panel__head"><div><span>CHI TIẾT YÊU CẦU</span><h2>{current.name}</h2></div><UserCog /></div><dl><div><dt>Quyền yêu cầu</dt><dd>{current.targetRole}</dd></div><div><dt>Lý do</dt><dd>{current.reason}</dd></div><div><dt>Trạng thái</dt><dd><Status value={current.status} /></dd></div></dl><div className="admin-request-evidence"><ShieldCheck /><div><strong>Kiểm tra tự động đã hoàn tất</strong><p>Email, hoạt động và hồ sơ công khai không có dấu hiệu bất thường.</p></div></div><footer><button onClick={() => act("approved")}><Check size={16} />Phê duyệt</button><button onClick={() => act("rejected")}><X size={16} />Từ chối</button></footer></article> : null}</div><Toast>{toast}</Toast>
  </section>;
}

export function AdminTaxonomyPage() {
  const state = useAdminState(); const [tag,setTag] = useState(""); const [category,setCategory] = useState("");
  const add = (collection,value,setter) => { if (!value.trim()) return; addAdminTaxonomy(collection,value); setter(""); };
  return <section className="admin-page"><PageHeader eyebrow="Content Structure" title="Quản lý Thẻ & Danh mục" description="Tổ chức taxonomy giúp nội dung được khám phá chính xác và nhất quán." />
    <div className="admin-visual-grid admin-visual-grid--taxonomy"><BarBreakdown title="Hashtag tăng trưởng" subtitle="7 NGÀY GẦN NHẤT" items={[{label:"#cafe",value:92,color:"var(--color-primary)"},{label:"#rooftop",value:76,color:"var(--color-secondary)"},{label:"#studyspot",value:61,color:"var(--color-accent)"}]} /><ActivityHeatmap title="Nhịp sử dụng thẻ" values={[3,5,4,7,9,6,5,8,9,7,4,6,8,10,7,5,8,9,6,4,7,8,5,3]} /><Sparkline label="Lượt khám phá từ thẻ" value="42.8k" values={[30,38,35,44,51,58,55,69,78,90]} /></div>
    <div className="admin-taxonomy-grid"><article className="admin-panel"><div className="admin-panel__head"><div><span>HASHTAG</span><h2>Thẻ đang hoạt động</h2></div><Hash /></div><form className="admin-add-form" onSubmit={e => {e.preventDefault();add("tags",tag,setTag);}}><input value={tag} onChange={e => setTag(e.target.value)} placeholder="#ten-the-moi" /><button><Plus size={16} />Thêm</button></form><div className="admin-token-list">{state.tags.map(item => <span key={item}>{item}<button onClick={() => removeAdminTaxonomy("tags",item)} aria-label={`Xóa ${item}`}><X size={13} /></button></span>)}</div></article>
      <article className="admin-panel"><div className="admin-panel__head"><div><span>PHÂN LOẠI</span><h2>Danh mục địa điểm</h2></div><Tags /></div><form className="admin-add-form" onSubmit={e => {e.preventDefault();add("categories",category,setCategory);}}><input value={category} onChange={e => setCategory(e.target.value)} placeholder="Tên danh mục mới" /><button><Plus size={16} />Thêm</button></form><div className="admin-category-list">{state.categories.map((item,index) => <div key={item}><span>{index + 1}</span><strong>{item}</strong><small>{120 + index * 46} địa điểm</small><button onClick={() => removeAdminTaxonomy("categories",item)}><Trash2 size={15} /></button></div>)}</div></article></div>
  </section>;
}
