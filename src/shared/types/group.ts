export type Group = {
  kai_id: bigint;
  group_leader_id: string;
  pinned_text: string;
  group_name: string;
  is_verified: boolean;
  verified_at: string;
  created_at: string;
  parsed_at: string;
  schedule_parsed_at: string;
  syllabus_url: string;
  educational_program_url: string;
};

export type GroupName = {
  id: string;
  kai_id: number;
  group_name: string;
  is_verified: boolean;
  parsed_at: string | null;
  schedule_parsed_at: string | null;
}