'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../globalRedux/store";


interface OnboardingGuardProps {
    children: React.ReactNode;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.authReducer.value.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user?.username || !user?.profile?.avatar) {
            router.replace("/onboarding");
        }
    }, [router, user]);

    return <>{children}</>;
};

export default OnboardingGuard;