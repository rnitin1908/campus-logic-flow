
import { GraduationCap } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <GraduationCap className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;
