import { Suspense } from "react";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { MetaLine, Skeleton } from "@/components/ui/primitives";
import type { Viewer } from "@/lib/auth/types";
import { listResponses } from "@/lib/content/repository";
import { ResponseLibrary } from "./response-library";

export async function ResponsesScreen({
  viewer,
  basePath = "",
}: {
  viewer: Viewer;
  basePath?: string;
}) {
  void basePath;
  const responses = await listResponses(viewer);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Quick Responses"
        title="Copy-ready messages"
        description="Approved wording for the situations that come up every shift. Fill in the details, copy, send — and adjust the tone to the person you are writing to."
        meta={<MetaLine items={[`${responses.length} responses`]} />}
      />

      {/* `useSearchParams` in the library requires a Suspense boundary so the
          rest of the page can still be statically rendered. */}
      <Suspense fallback={<LibrarySkeleton />}>
        <ResponseLibrary
          responses={responses}
          technicianName={viewer.user?.name}
        />
      </Suspense>
    </PageContainer>
  );
}

function LibrarySkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="h-11 w-full" />
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-[4.5rem] w-full" />
      ))}
    </div>
  );
}
