import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/common/Button.jsx";
import "./PrototypePage.css";

export function PrototypePage({ eyebrow, title, description }) {
  const navigate = useNavigate();

  return (
    <section className="prototype-page">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} aria-hidden="true" />
        Quay lại
      </Button>
    </section>
  );
}
