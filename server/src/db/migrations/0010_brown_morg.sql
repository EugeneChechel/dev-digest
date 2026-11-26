ALTER TABLE "agent_runs" ADD COLUMN "cost_usd" double precision;--> statement-breakpoint
ALTER TABLE "agent_runs" ADD COLUMN "round_id" uuid;