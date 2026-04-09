import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "yaml";

const ARTICLES_DIR = path.join(__dirname, "..", "..", "..", "data", "articles");

export interface ParsedArticle {
  slug: string;
  title: string;
  summary: string;
  content: string;
  category_name: string;
  tags: string[];
  created_at: Date;
}

export interface ParsedUserAgent {
  device: string;
  browser: string;
  os: string;
}

@Injectable()
export class MarkdownService {
  private articlesCache: ParsedArticle[] | null = null;

  parseFrontMatter(content: string): { frontMatter: Record<string, any>; body: string } {
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) {
      return { frontMatter: {}, body: content };
    }
    const frontMatter = yaml.parse(match[1]) || {};
    const body = match[2];
    return { frontMatter, body };
  }

  extractArticleMetadata(filepath: string): ParsedArticle | null {
    try {
      const content = fs.readFileSync(filepath, "utf-8");
      const { frontMatter, body } = this.parseFrontMatter(content);

      const slug =
        frontMatter["slug"] ||
        path.basename(filepath, path.extname(filepath));
      const title = frontMatter["title"] || slug;
      const summary = frontMatter["summary"] || "";
      const categoryName = frontMatter["category"] || "未分类";
      const tags = frontMatter["tags"] || [];
      const createdAtStr = frontMatter["created_at"];

      let createdAt: Date;
      if (createdAtStr) {
        const parsed = new Date(createdAtStr);
        createdAt = isNaN(parsed.getTime())
          ? new Date()
          : parsed;
      } else {
        createdAt = new Date();
      }

      return {
        slug,
        title,
        summary,
        content: body.trim(),
        category_name: categoryName,
        tags,
        created_at: createdAt,
      };
    } catch {
      return null;
    }
  }

  scanArticles(): ParsedArticle[] {
    if (!fs.existsSync(ARTICLES_DIR)) {
      return [];
    }

    const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
    const articles: ParsedArticle[] = [];

    for (const file of files) {
      const filepath = path.join(ARTICLES_DIR, file);
      const article = this.extractArticleMetadata(filepath);
      if (article) {
        articles.push(article);
      }
    }

    return articles.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );
  }

  parseUserAgent(userAgentStr: string): ParsedUserAgent {
    if (!userAgentStr) {
      return { device: "Unknown", browser: "Unknown", os: "Unknown" };
    }

    const ua = userAgentStr.toLowerCase();

    let device = "Unknown";
    if (ua.includes("mobile") || ua.includes("android")) device = "Mobile";
    else if (ua.includes("tablet") || ua.includes("ipad")) device = "Tablet";
    else if (ua.includes("bot") || ua.includes("crawl") || ua.includes("spider")) device = "Bot";
    else device = "PC";

    let browser = "Unknown";
    if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
    else if (ua.includes("edg")) browser = "Edge";

    let os = "Unknown";
    if (ua.includes("windows")) os = "Windows";
    else if (ua.includes("mac os") || ua.includes("macos")) os = "macOS";
    else if (ua.includes("linux") && !ua.includes("android")) os = "Linux";
    else if (ua.includes("android")) os = "Android";
    else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

    return { device, browser, os };
  }

  isValidUserAgent(userAgent: string): boolean {
    if (!userAgent) return false;
    const botPatterns = [
      "python",
      "requests",
      "curl",
      "wget",
      "scrapy",
      "bot",
      "crawl",
      "spider",
    ];
    const uaLower = userAgent.toLowerCase();
    return !botPatterns.some((pattern) => uaLower.includes(pattern));
  }

  invalidateCache(): void {
    this.articlesCache = null;
  }

  getArticlesFromCache(): ParsedArticle[] {
    if (this.articlesCache === null) {
      this.articlesCache = this.scanArticles();
    }
    return this.articlesCache;
  }
}
