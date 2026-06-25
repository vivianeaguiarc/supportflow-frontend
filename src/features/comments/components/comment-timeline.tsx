"use client";

import { MessageSquare } from "lucide-react";

import { Can } from "@/components/auth";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getErrorMessage } from "@/lib/api-error";

import { useTicketComments } from "../hooks";
import { CommentCard } from "./comment-card";
import { CreateCommentForm } from "./create-comment-form";

interface CommentTimelineProps {
  ticketId: string;
}

/**
 * Seção de comentários internos do ticket: timeline (ordem cronológica) +
 * formulário de novo comentário. Cobre loading, erro, vazio e submitting, e
 * gateia a criação por `tickets:comment` (RBAC visual).
 */
export function CommentTimeline({ ticketId }: CommentTimelineProps) {
  const { data, isLoading, isError, error, refetch } =
    useTicketComments(ticketId);

  const comments = data ?? [];

  return (
    <Card>
      <CardContent className="space-y-5">
        {isLoading ? (
          <LoadingState label="Carregando comentários..." />
        ) : isError ? (
          <ErrorState
            title="Não foi possível carregar os comentários"
            description={getErrorMessage(
              error,
              "Tente novamente em instantes.",
            )}
            onRetry={() => refetch()}
          />
        ) : comments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Nenhum comentário ainda"
            description="Registre o primeiro comentário interno deste chamado."
          />
        ) : (
          <Timeline>
            {comments.map((comment, index) => (
              <TimelineItem
                key={comment.id}
                isLast={index === comments.length - 1}
                marker={
                  <UserAvatar
                    name={comment.author?.name ?? comment.authorId}
                    size="sm"
                  />
                }
              >
                <CommentCard comment={comment} />
              </TimelineItem>
            ))}
          </Timeline>
        )}

        <Can perform="tickets:comment">
          <CreateCommentForm ticketId={ticketId} />
        </Can>
      </CardContent>
    </Card>
  );
}
