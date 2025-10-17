import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  showAfterScrollY?: number; // Distance in pixels before showing the button
}

export function ScrollToTopButton({ showAfterScrollY = 400 }: ScrollToTopButtonProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls past the threshold
      setShowScrollTop(window.scrollY > showAfterScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showAfterScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showScrollTop) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg"
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
