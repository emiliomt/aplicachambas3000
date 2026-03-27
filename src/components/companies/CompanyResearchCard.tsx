"use client";

import { CompanyResearchData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2, Package, Heart, Lightbulb, MessageSquare,
  HelpCircle, AlertTriangle
} from "lucide-react";

interface CompanyResearchCardProps {
  companyName: string;
  research: CompanyResearchData;
}

function Section({
  icon: Icon,
  title,
  items,
  colorClass = "",
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
  colorClass?: string;
}) {
  if (!items?.length) return null;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm flex items-center gap-2 ${colorClass}`}>
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 opacity-50">•</span>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function CompanyResearchCard({ companyName, research }: CompanyResearchCardProps) {
  const { overview } = research;

  return (
    <div className="space-y-4">
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {companyName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {overview.mission && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Mission: </span>
                {overview.mission}
              </div>
            )}
            {overview.industry && (
              <div>
                <span className="text-muted-foreground">Industry: </span>
                {overview.industry}
              </div>
            )}
            {overview.size && (
              <div>
                <span className="text-muted-foreground">Size: </span>
                {overview.size}
              </div>
            )}
            {overview.founded && (
              <div>
                <span className="text-muted-foreground">Founded: </span>
                {overview.founded}
              </div>
            )}
            {overview.headquarters && (
              <div>
                <span className="text-muted-foreground">HQ: </span>
                {overview.headquarters}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Section icon={Package} title="Products & Services" items={research.products_services} />
        <Section icon={Heart} title="Culture & Values" items={research.culture_values} colorClass="text-rose-600" />
        <Section icon={Lightbulb} title="Interview Tips" items={research.interview_tips} colorClass="text-amber-600" />
        <Section icon={MessageSquare} title="Talking Points" items={research.talking_points} colorClass="text-blue-600" />
        <Section icon={HelpCircle} title="Questions to Ask" items={research.questions_to_ask} colorClass="text-purple-600" />
        <Section icon={AlertTriangle} title="Watch Out For" items={research.watch_out_for} colorClass="text-orange-600" />
      </div>
    </div>
  );
}
