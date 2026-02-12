import Link from "next/link";
import { usePathname } from "next/navigation";

export default function () {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // Split the pathname into segments    /home/about => ['home', 'about']

  return (
    <nav className="text-sm absolute top-2 left-[5%] z-10 text-dark/70">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-dark">
            Home
          </Link>
        </li>

        {/* Render the breadcrumb segments */}
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="text-dark font-medium capitalize">
                  {segment.replace("-", " ")}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:text-dark capitalize"
                >
                  {segment.replace("-", " ")}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
