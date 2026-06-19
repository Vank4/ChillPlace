import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  Eye,
  FileImage,
  Hash,
  ImagePlus,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Save,
  Search,
  Send,
  Sparkles,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPlaces } from "../../../services/place.service.js";
import {
  getCreatorDraft,
  publishCreatorPost,
  saveCreatorDraft
} from "../../../services/creator.service.js";
import { getUserProfile } from "../../../services/profile.service.js";
import "./CreatePostPage.css";

const defaultValues = {
  title: "",
  content: "",
  locationKeyword: "",
  selectedPlaceId: "",
  hashtags: ["ChillPlace", "CafeSgon"]
};

const hashtagSuggestions = [
  "ChillPlace",
  "CafeSgon",
  "VibeMap",
  "WeekendVibe",
  "Workspace",
  "Sunset",
  "HiddenGem",
  "DalatVibe"
];

const fallbackMapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDgKQ_xdBvHxlpY8TK6Nj_9vmWpA_Rtfcz7XD48K7a99Qn8rvkgvChD2WRPuP8UjWvW9GcmB_xVupUWUwO60vkgI9Ssm9FL7rMjgLZV_usC4DHWyQjX8jYJfOhNZ-4DCymPfuPULbnmRfWiWxPxgyqxmRTI7jT66UNr4WqM1Nhs4kJ78ULnH03QDpHUYURw0FCBAmO-CqlHU61zRjeRmgxe1jG0yEVpdknWw_9IvypgfX32RHOgc19VVOdV_BxG507lylfgr9Ssbuo";

export function CreatePostPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const profile = useMemo(() => getUserProfile(), []);
  const storedDraft = useMemo(() => getCreatorDraft(), []);
  const [values, setValues] = useState(() => ({
    ...defaultValues,
    ...storedDraft,
    media: []
  }));
  const [places, setPlaces] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getPlaces({ delayMs: 120 }).then((nextPlaces) => {
      setPlaces(nextPlaces.slice(0, 5));
    });
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const draft = saveCreatorDraft({
        title: values.title,
        content: values.content,
        locationKeyword: values.locationKeyword,
        selectedPlaceId: values.selectedPlaceId,
        hashtags: values.hashtags
      });

      setToast(`Đã lưu tự động ${formatTime(draft.updatedAt)}`);
      window.setTimeout(() => setToast(""), 1800);
    }, 700);

    return () => window.clearTimeout(timerId);
  }, [
    values.title,
    values.content,
    values.locationKeyword,
    values.selectedPlaceId,
    values.hashtags
  ]);

  const selectedPlace = places.find((place) => place.id === values.selectedPlaceId);
  const filteredPlaces = useMemo(() => {
    const keyword = normalizeText(values.locationKeyword);

    if (!keyword) return places.slice(0, 3);

    return places.filter((place) =>
      normalizeText(`${place.name} ${place.area} ${place.category}`).includes(keyword)
    );
  }, [places, values.locationKeyword]);

  const wordCount = values.content.trim()
    ? values.content.trim().split(/\s+/).length
    : 0;
  const completionScore = [
    values.title.trim(),
    wordCount >= 20,
    selectedFiles.length > 0,
    values.selectedPlaceId,
    values.hashtags.length > 0
  ].filter(Boolean).length;

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormError("");
  }

  function addFiles(fileList) {
    const nextFiles = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .slice(0, 10 - selectedFiles.length)
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl: URL.createObjectURL(file)
      }));

    if (nextFiles.length === 0) {
      setFormError("Chọn ảnh hoặc video hợp lệ để thêm vào bài viết.");
      return;
    }

    setSelectedFiles((current) => [...current, ...nextFiles].slice(0, 10));
  }

  function removeFile(fileId) {
    setSelectedFiles((current) => {
      const removedFile = current.find((file) => file.id === fileId);
      if (removedFile) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }
      return current.filter((file) => file.id !== fileId);
    });
  }

  function toggleHashtag(tag) {
    setValues((current) => {
      const isSelected = current.hashtags.includes(tag);
      return {
        ...current,
        hashtags: isSelected
          ? current.hashtags.filter((item) => item !== tag)
          : [...current.hashtags, tag].slice(0, 8)
      };
    });
  }

  function validatePost() {
    if (!values.title.trim()) return "Anh cần nhập tiêu đề bài viết.";
    if (wordCount < 20) return "Nội dung review cần tối thiểu 20 từ.";
    if (selectedFiles.length === 0) return "Thêm ít nhất một ảnh hoặc video.";
    if (!values.selectedPlaceId) return "Chọn một địa điểm để gắn với bài viết.";
    return "";
  }

  async function handlePublish() {
    const error = validatePost();

    if (error) {
      setFormError(error);
      return;
    }

    setIsPublishing(true);
    const nextPost = await publishCreatorPost({
      title: values.title.trim(),
      content: values.content.trim(),
      place: selectedPlace,
      hashtags: values.hashtags,
      media: selectedFiles.map(({ name, type, size }) => ({ name, type, size }))
    });

    setToast("Bài viết đã được đăng thành công");
    setIsPublishing(false);
    window.setTimeout(() => navigate(`/posts/${nextPost.id}`), 700);
  }

  return (
    <main className="create-post-page">
      <header className="create-post-hero">
        <button className="create-post-hero__back" type="button" onClick={() => navigate(-1)}>
          <ChevronLeft size={17} />
          <span>Thoát</span>
        </button>
        <div>
          <span>Creator Center</span>
          <h1>Tạo bài viết mới</h1>
          <p>Kể lại trải nghiệm chill bằng hình ảnh, địa điểm và hashtag gọn gàng.</p>
        </div>
        <div className="create-post-hero__profile">
          <span>Nháp tự động</span>
          <img src={profile.avatarUrl} alt={`Ảnh đại diện ${profile.name}`} />
        </div>
      </header>

      <section className="create-post-layout">
        <div className="create-post-media">
          <SectionLabel icon={ImagePlus} title="Ảnh & video trải nghiệm" />
          <button
            className={isDragActive ? "create-post-dropzone is-dragging" : "create-post-dropzone"}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragActive(false);
              addFiles(event.dataTransfer.files);
            }}
          >
            {selectedFiles[0] ? (
              <img src={selectedFiles[0].previewUrl} alt="" />
            ) : (
              <>
                <span><Camera size={28} /></span>
                <strong>Thêm ảnh/video</strong>
                <small>Kéo thả hoặc chọn từ máy, tối đa 10 tệp.</small>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />

          <div className="create-post-thumbs" aria-label="Media đã chọn">
            {Array.from({ length: 4 }).map((_, index) => {
              const file = selectedFiles[index];

              return file ? (
                <button key={file.id} type="button" onClick={() => removeFile(file.id)}>
                  <img src={file.previewUrl} alt={file.name} />
                  <X size={13} />
                </button>
              ) : (
                <span key={`empty-${index}`}><FileImage size={16} /></span>
              );
            })}
          </div>

          <div className="create-post-progress">
            <strong>{completionScore}/5</strong>
            <span>mục đã sẵn sàng</span>
            <div><i style={{ width: `${completionScore * 20}%` }} /></div>
          </div>
        </div>

        <form className="create-post-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            Tiêu đề bài viết
            <input
              value={values.title}
              maxLength={80}
              placeholder="Nhập tiêu đề thu hút người đọc..."
              onChange={(event) => updateField("title", event.target.value)}
            />
          </label>

          <label>
            Nội dung review
            <textarea
              value={values.content}
              maxLength={2000}
              rows={5}
              placeholder="Chia sẻ cảm nhận, không gian, đồ uống, góc ngồi đẹp..."
              onChange={(event) => updateField("content", event.target.value)}
            />
            <span>{wordCount} từ · {values.content.length}/2000 ký tự</span>
          </label>

          <section className="create-post-location">
            <SectionLabel icon={MapPin} title="Gắn thẻ địa điểm" />
            <label className="create-post-location__search">
              <Search size={16} />
              <input
                value={values.locationKeyword}
                placeholder="Tìm quán cafe, studio, điểm check-in..."
                onChange={(event) => updateField("locationKeyword", event.target.value)}
              />
            </label>

            <div className="create-post-map">
              <img src={fallbackMapImage} alt="" />
              <span><MapPin size={32} fill="currentColor" /></span>
            </div>

            <div className="create-post-place-list">
              {filteredPlaces.slice(0, 3).map((place) => (
                <button
                  className={place.id === values.selectedPlaceId ? "is-selected" : ""}
                  key={place.id}
                  type="button"
                  onClick={() => updateField("selectedPlaceId", place.id)}
                >
                  <MapPin size={14} />
                  <span>
                    <strong>{place.name}</strong>
                    <small>{place.area} · {place.category}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="create-post-tags">
            <SectionLabel icon={Hash} title="Hashtag" />
            <div>
              {hashtagSuggestions.map((tag) => (
                <button
                  className={values.hashtags.includes(tag) ? "is-selected" : ""}
                  key={tag}
                  type="button"
                  aria-pressed={values.hashtags.includes(tag)}
                  onClick={() => toggleHashtag(tag)}
                >
                  <span aria-hidden="true">#</span>
                  {tag}
                </button>
              ))}
              <button className="create-post-tags__add" type="button" onClick={() => toggleHashtag("NewVibe")}>
                <Plus size={14} />
                Thêm
              </button>
            </div>
          </section>

          {formError ? (
            <div className="create-post-error" role="alert">
              <CircleAlert size={15} />
              {formError}
            </div>
          ) : null}
        </form>
      </section>

      <footer className="create-post-actions">
        <div>
          <CheckCircle2 size={16} />
          {toast || "Bản nháp được lưu tự động"}
        </div>
        <nav>
          <button type="button" onClick={() => setPreviewOpen(true)}>
            <Eye size={16} />
            Xem trước
          </button>
          <button type="button" onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? <Loader2 className="is-spinning" size={16} /> : <Send size={16} />}
            {isPublishing ? "Đang đăng..." : "Đăng bài ngay"}
          </button>
        </nav>
      </footer>

      {previewOpen ? (
        <PreviewDialog
          values={values}
          place={selectedPlace}
          files={selectedFiles}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </main>
  );
}

function SectionLabel({ icon: Icon, title }) {
  return (
    <div className="create-post-section-label">
      <Icon size={16} />
      <span>{title}</span>
    </div>
  );
}

function PreviewDialog({ values, place, files, onClose }) {
  return (
    <div className="create-post-preview" role="dialog" aria-modal="true" aria-labelledby="create-preview-title">
      <button className="create-post-preview__backdrop" type="button" aria-label="Đóng" onClick={onClose} />
      <article>
        <header>
          <div>
            <span>Xem trước</span>
            <h2 id="create-preview-title">{values.title || "Tiêu đề bài viết"}</h2>
          </div>
          <button type="button" aria-label="Đóng" onClick={onClose}><X size={18} /></button>
        </header>
        {files[0] ? <img src={files[0].previewUrl} alt="" /> : <div className="create-post-preview__empty"><Sparkles size={28} /></div>}
        <p>{values.content || "Nội dung review sẽ hiển thị tại đây."}</p>
        <footer>
          {place ? <span><MapPin size={14} />{place.name}</span> : null}
          {values.hashtags.map((tag) => <strong key={tag}>#{tag}</strong>)}
        </footer>
      </article>
    </div>
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

function formatTime(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
