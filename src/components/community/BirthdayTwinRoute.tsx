"use client";

import { useSearchParams } from "next/navigation";
import BirthdayTwin from "@/components/community/BirthdayTwin";
import { parseDateKey, type BirthdayHero } from "@/lib/birthdays";

export default function BirthdayTwinRoute({ birthdays }: { birthdays: BirthdayHero[] }) {
    const queryDate = useSearchParams().get("date");
    const parsed = parseDateKey(queryDate);

    return (
        <BirthdayTwin
            key={parsed ? queryDate : "today"}
            birthdays={birthdays}
            initialDate={parsed}
        />
    );
}
