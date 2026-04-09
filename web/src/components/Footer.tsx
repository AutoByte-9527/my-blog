import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--foreground)]/10">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center text-[var(--muted)] text-sm">
          <p>墨韵 · 用文字记录生活</p>
          <p className="mt-2">
            <Link to="/" className="hover:text-[var(--accent)] transition-colors">
              首页
            </Link>
            {" · "}
            <Link to="/archives" className="hover:text-[var(--accent)] transition-colors">
              归档
            </Link>
          </p>
          {/* 备案信息 - 备案后取消注释并填写 */}
          {/* <p className="mt-2">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              京ICP备XXXXXXXX号
            </a>
          </p> */}
        </div>
      </div>
    </footer>
  );
}
