import MainLayout from "@/layouts/MainLayout";
import BreadcrumbNav from "@/components/comm/BreadcrumbNav";
import {
  ApiKeyManager,
  ModelManager,
  RestTimeManager,
} from "@/components/settings";

export default function SettingsPage() {
  return (
    <MainLayout>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "控制台", href: "/controlpanel" },
          { label: "设置", isPage: true },
        ]}
      />
      <main className="flex justify-center gap-y-4 h-full flex-col w-[350px] mx-auto">
        <ApiKeyManager />
        <ModelManager />
        <RestTimeManager />
      </main>
    </MainLayout>
  );
}
