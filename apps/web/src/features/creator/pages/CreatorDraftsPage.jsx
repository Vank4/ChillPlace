import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Edit3,
  FileEdit,
  Plus,
  Search,
  Sparkles,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  CreatorCenterHeader,
  CreatorCenterNav,
  CreatorStatCard
} from "../components/CreatorCenterNav.jsx";
import { clearCreatorDraft, getCreatorDraftList } from "../../../services/creator.service.js";
import "./CreatorPages.css";

export function CreatorDraftsPage() {
  const initialDrafts = useMemo(() => getCreatorDraftList(), []);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [keyword, setKeyword] = useState("");
  const [toast, setToast] = useState("");

  const filteredDrafts = useMemo(() => {
    const cleanKeyword = normalizeText(keyword);

    return drafts.filter((draft) =>
      normalizeText(`${draft.title} ${draft.content} ${draft.place?.name ?? ""}`).includes(cleanKeyword)
    );
  }, [drafts, keyword]);

  function removeDraft(draft) {
    if (draft.isCurrent) {
      clearCreatorDraft();
    }

    setDrafts((current) => current.filter((item) => item.id !== draft.id));
    setToast(`Đã xóa bản nháp "${draft.title}"`);
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="creator-page">
      <CreatorCenterHeader
        eyebrow="Draft Studio"
        title="Bản nháp đang chờ hoàn thiện"
        description="Gom các ý tưởng còn dang dở, nhắc phần còn thiếu và mở nhanh trang tạo bài để viết tiếp."
        action={
          <Link className="creator-center-action" to="/creator/posts/new">
            <Plus size={16} />
            Viết tiếp
          </Link>
        }
      />

      <CreatorCenterNav />

      <section className="creator-stats-grid creator-stats-grid--three">
        <CreatorStatCard icon={FileEdit} label="Bản nháp" value={drafts.length} />
        <CreatorStatCard
          icon={CheckCircle2}
          label="Sẵn sàng cao"
          value={drafts.filter((draft) => draft.completion >= 70).length}
          tone="green"
        />
        <CreatorStatCard
          icon={Clock3}
          label="Cập nhật gần đây"
          value={drafts.length ? formatRelative(drafts[0].updatedAt) : "0"}
          tone="blue"
        />
      </section>

      <section className="creator-toolbar creator-toolbar--single">
        <label>
          <Search size={16} />
          <input
            value={keyword}
            placeholder="Tìm trong bản nháp..."
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>
      </section>

      {toast ? (
        <div className="creator-toast" role="status">
          <CheckCircle2 size={15} />
          {toast}
        </div>
      ) : null}

      <section className="creator-draft-grid" aria-label="Danh sách bản nháp">
        {filteredDrafts.map((draft) => (
          <article className="creator-draft-card" key={draft.id}>
            <img src={draft.imageUrl} alt="" />
            <div>
              <span>
                <Clock3 size={13} />
                {formatDate(draft.updatedAt)}
              </span>
              <h2>{draft.title}</h2>
              <p>{draft.content}</p>
              <div className="creator-draft-card__progress">
                <strong>{draft.completion}% hoàn thiện</strong>
                <i>
                  <b style={{ width: `${draft.completion}%` }} />
                </i>
              </div>
              <div className="creator-draft-card__missing">
                {draft.missingItems?.length ? (
                  draft.missingItems.map((item) => <small key={item}>{item}</small>)
                ) : (
                  <small>Sẵn sàng xem lại</small>
                )}
              </div>
              <footer>
                <Link to="/creator/posts/new">
                  <Edit3 size={15} />
                  Mở chỉnh sửa
                </Link>
                <button type="button" onClick={() => removeDraft(draft)}>
                  <Trash2 size={15} />
                  Xóa
                </button>
              </footer>
            </div>
          </article>
        ))}
      </section>

      {filteredDrafts.length === 0 ? (
        <section className="creator-empty-state">
          <Sparkles size={30} />
          <h2>Chưa có bản nháp phù hợp</h2>
          <p>Anh có thể bắt đầu một bài mới, hệ thống sẽ tự lưu trong lúc viết.</p>
          <Link className="creator-center-action" to="/creator/posts/new">
            <Plus size={16} />
            Tạo bản nháp mới
          </Link>
        </section>
      ) : null}
    </main>
  );
}

function normalizeText(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatRelative(value) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.max(1, Math.round(diffMs / 36e5));

  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)} ngày`;
}

