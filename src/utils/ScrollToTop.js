import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const isBackNavigation = useRef(false);
    const lastClickScrollPosition = useRef(null); // حفظ موضع الضغط فقط
    const prevPathRef = useRef(null); // المسار السابق

    // حفظ موضع السكرول عند الضغط على أي رابط
    useEffect(() => {
        const handleClick = () => {
            lastClickScrollPosition.current = window.scrollY; // نحفظ مكان الضغط فقط
        };

        document.addEventListener("click", handleClick, true);
        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, []);

    useEffect(() => {
        if (isBackNavigation.current && lastClickScrollPosition.current !== null) {
            // لما نضغط Back، نرجع للمكان اللي ضغطنا منه
            window.scrollTo({
                top: lastClickScrollPosition.current,
                behavior: "smooth",
            });
        } else {
            // في التنقل العادي، يروح لأول الصفحة
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        isBackNavigation.current = false; // إعادة تعيين الفلاغ
        return () => {
            prevPathRef.current = pathname; // تحديث المسار السابق
        };
    }, [pathname]);

    // كشف زر الرجوع في المتصفح
    useEffect(() => {
        let timer = null;
        const handlePopState = () => {
            isBackNavigation.current = true;

            timer = setTimeout(() => {
                lastClickScrollPosition.current = null; // حذف الموضع اللي ضغطنا منه
            }, 1000);
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return null;
};

export default ScrollToTop;
