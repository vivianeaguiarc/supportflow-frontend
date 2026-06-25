"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CardStat } from "@/components/ui/card-stat";

import { useAnalyticsCsat } from "../hooks";
import { AnalyticsSection } from "./analytics-section";
import { formatNumber, formatRating } from "./format";

export function CsatSection() {
  const { data, isLoading, isError, error, refetch } = useAnalyticsCsat();

  return (
    <AnalyticsSection
      title="CSAT — satisfação"
      description="Avaliações de satisfação dos clientes."
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={data?.totalSurveys === 0}
      emptyDescription="Nenhuma pesquisa de satisfação respondida ainda."
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <CardStat
              label="Nota média"
              value={formatRating(data.averageRating)}
              description="Escala de 1 a 5"
            />
            <CardStat
              label="Pesquisas respondidas"
              value={formatNumber(data.totalSurveys)}
            />
          </div>
          {data.distribution.length > 0 ? (
            <Card>
              <CardContent className="space-y-3">
                {data.distribution
                  .slice()
                  .sort((a, b) => b.rating - a.rating)
                  .map((item) => (
                    <div
                      key={item.rating}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="text-muted-foreground">
                        Nota {item.rating}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatNumber(item.count)}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}
    </AnalyticsSection>
  );
}
