import { Link, type LinkProps } from "react-router-dom";
import { forwardRef } from "react";

/**
 * ScrollLink — Wrapper autour de React Router Link qui scroll en haut
 * IMMÉDIATEMENT au clic (avant la navigation), pas après.
 */
const ScrollLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ onClick, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        onClick={(e) => {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          onClick?.(e);
        }}
        {...props}
      />
    );
  }
);

ScrollLink.displayName = "ScrollLink";
export default ScrollLink;
