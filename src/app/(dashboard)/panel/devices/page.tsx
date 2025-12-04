import { Metadata } from "next";
import DevicesList from "./DevicesList";

export const metadata: Metadata = {
    title: "Devices | Dashboard",
    description: "Manage GPS tracking devices",
};

export default function DevicesPage() {
    return <DevicesList />;
}
