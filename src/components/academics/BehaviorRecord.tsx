
import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BehaviorRecord as BehaviorRecordType } from '@/types/student';
import { ScrollArea } from "@/components/ui/scroll-area";

interface BehaviorRecordProps {
  records: BehaviorRecordType[];
  title?: string;
  description?: string;
  maxHeight?: string;
}

const BehaviorRecord: React.FC<BehaviorRecordProps> = ({
  records,
  title = "Behavior Records",
  description = "Student behavior and discipline history",
  maxHeight = "400px",
}) => {
  // Helper function to determine severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'minor':
        return "bg-blue-100 text-blue-800";
      case 'moderate':
        return "bg-yellow-100 text-yellow-800";
      case 'major':
        return "bg-orange-100 text-orange-800";
      case 'critical':
        return "bg-red-100 text-red-800";
      case 'positive':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to determine category badge color
  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes('positive') || 
        category.toLowerCase().includes('recognition')) {
      return "bg-green-100 text-green-800";
    }
    return "bg-slate-100 text-slate-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`pr-4 ${maxHeight ? `max-h-[${maxHeight}]` : ''}`}>
          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No behavior records available
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Card key={record.id} className="overflow-hidden border-l-4" 
                  style={{ 
                    borderLeftColor: record.severity.toLowerCase() === 'positive' 
                      ? '#10b981' 
                      : record.severity.toLowerCase() === 'critical' 
                        ? '#ef4444' 
                        : '#f59e0b' 
                  }}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-medium">{record.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(record.incident_date), 'PPP')}
                          {record.reporter?.name ? ` • Reported by ${record.reporter.name}` : ''}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getCategoryColor(record.category)}>
                          {record.category}
                        </Badge>
                        <Badge variant="outline" className={getSeverityColor(record.severity)}>
                          {record.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm">{record.description}</p>
                    
                    {record.action_taken && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs font-medium">Action Taken:</p>
                        <p className="text-sm">{record.action_taken}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BehaviorRecord;
