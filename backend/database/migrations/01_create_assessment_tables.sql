-- Assessment Questions table
CREATE TABLE assessment_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE TABLE assessment_framework (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
