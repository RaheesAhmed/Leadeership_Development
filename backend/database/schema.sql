-- User table
CREATE TABLE
  public.users (
    id uuid not null,
    name text not null,
    email text not null,
    role text null,
    department text null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    constraint users_pkey primary key (id),
    constraint users_email_key unique (email)
  ) tablespace pg_default;


--assessments table
CREATE TABLE
  public.assessments (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    responsibility_level character varying(255) not null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    constraint assessments_pkey primary key (id)
  ) tablespace pg_default;

--development plans table
CREATE TABLE
  public.development_plans (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid not null,
    formatted_plan text not null,
    raw_plan jsonb not null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    constraint development_plans_pkey primary key (id),
    constraint development_plans_user_id_fkey foreign key (user_id) references users (id)
    ) tablespace pg_default;

CREATE INDEX if not exists idx_development_plans_user_id on public.development_plans using btree (user_id) tablespace pg_default;

CREATE TRIGGER update_development_plans_updated_at before
UPDATE on development_plans for each row
EXECUTE function update_updated_at_column ();

--Ratings table
CREATE TABLE
  public.ratings (
    id uuid not null default extensions.uuid_generate_v4 (),
    assessment_id uuid null,
    capability character varying(255) not null,
    rating integer not null,
    confidence integer not null,
    explanation text null,
    created_at timestamp with time zone null default current_timestamp,
    updated_at timestamp with time zone null default current_timestamp,
    constraint ratings_pkey primary key (id),
    constraint ratings_assessment_id_fkey foreign key (assessment_id) references assessments (id),
    constraint ratings_confidence_check check (
      (
        (confidence >= 1)
        and (confidence <= 5)
      )
    ),
    constraint ratings_rating_check check (
      (
        (rating >= 1)
        and (rating <= 5)
      )
    )
  ) tablespace pg_default;


-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'expired'))
);

-- Consultant profiles table
CREATE TABLE consultant_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    company_name VARCHAR(255),
    website VARCHAR(255),
    api_key VARCHAR(255) UNIQUE,
    api_key_created_at TIMESTAMP WITH TIME ZONE,
    white_label_enabled BOOLEAN DEFAULT false,
    revenue_share_percentage DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Multi-rater assessments table
CREATE TABLE multi_rater_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed'))
);

-- Multi-rater ratings table
CREATE TABLE multi_rater_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assessment_id UUID REFERENCES multi_rater_assessments(id) NOT NULL,
    rater_email VARCHAR(255) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    answers JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API usage tracking table
CREATE TABLE api_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultant_id UUID REFERENCES consultant_profiles(id) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_consultant_profiles_user_id ON consultant_profiles(user_id);
CREATE INDEX idx_multi_rater_assessments_user_id ON multi_rater_assessments(user_id);
CREATE INDEX idx_multi_rater_ratings_assessment_id ON multi_rater_ratings(assessment_id);
CREATE INDEX idx_api_usage_consultant_id ON api_usage(consultant_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultant_profiles_updated_at
    BEFORE UPDATE ON consultant_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_multi_rater_assessments_updated_at
    BEFORE UPDATE ON multi_rater_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_multi_rater_ratings_updated_at
    BEFORE UPDATE ON multi_rater_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add development plans table
CREATE TABLE development_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    formatted_plan TEXT NOT NULL,
    raw_plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups
CREATE INDEX idx_development_plans_user_id ON development_plans(user_id);

-- Add trigger to update updated_at
CREATE TRIGGER update_development_plans_updated_at
    BEFORE UPDATE ON development_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Assessment Questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE,
    role_name TEXT NOT NULL,
    description TEXT,
    building_team_skill TEXT,
    building_team_confidence TEXT,
    developing_others_skill TEXT,
    developing_others_confidence TEXT,
    leading_team_skill TEXT,
    leading_team_confidence TEXT,
    managing_performance_skill TEXT,
    managing_performance_confidence TEXT,
    business_acumen_skill TEXT,
    business_acumen_confidence TEXT,
    personal_development_skill TEXT,
    personal_development_confidence TEXT,
    communication_skill TEXT,
    communication_confidence TEXT,
    employee_relations_skill TEXT,
    employee_relations_confidence TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Framework table
CREATE TABLE IF NOT EXISTS assessment_framework (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    target_audience TEXT NOT NULL UNIQUE,
    building_team TEXT,
    developing_others TEXT,
    leading_team TEXT,
    managing_performance TEXT,
    business_acumen TEXT,
    personal_development TEXT,
    communication TEXT,
    employee_relations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_assessment_questions_updated_at
    BEFORE UPDATE ON assessment_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_framework_updated_at
    BEFORE UPDATE ON assessment_framework
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
