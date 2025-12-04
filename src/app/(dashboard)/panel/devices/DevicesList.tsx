"use client";

import { EntityList } from "@/components/shared";
import { createDevicesConfig } from "./config";

export default function DevicesList() {
    const config = createDevicesConfig();

    return (
        <EntityList
            config={config}
            title="Devices"
            description="Manage GPS tracking devices"
        />
    );
}
