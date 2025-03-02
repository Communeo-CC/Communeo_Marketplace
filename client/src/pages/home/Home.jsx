import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap, Handshake , Youtube } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import sanuriGif from "../../assets/sanuri.gif";
import GIF1 from "../../assets/GIF1.gif";
import GIF2 from "../../assets/GIF2.gif";
import Freelancers from "../freelancer/Freelancer";


const Home = ({
  badge = "",
  heading = "Revolutionizing Marketing Through Smart Connections",
  description = "Join us to connect, collaborate, and grow.",
  tabs = [
    {
      value: "tab-1",
      icon: <Handshake className="h-auto w-4 shrink-0" />,
      label: "Freelancer Marketplace",
      component: Freelancers,
      content: {
        badge:"",
        title: "Find the Perfect Freelancer for Your Needs.",
        description:
          "Connect with skilled freelancers who can bring your marketing vision to life. From graphic designers to content creators, find the right experts for your project. ",
        buttonText: (
            <Link className="link" to="/freelancer">
              Explore Freelancers
            </Link>
        ),
        buttonLink: "/freelancers",

      imageSrc: sanuriGif,
      imageAlt: "Gif",
      },
    },
    {
      value: "tab-2",
      icon: <Youtube className="h-auto w-4 shrink-0" />,
      label: "Influencer Marketplace",
      content: {
        badge: "",
        title: "Maximize Your Reach with the Right Influencers.",
        description:
          "Discover and collaborate with influencers who align with your brand. Create impactful campaigns that engage and convert your target audience.",
        buttonText: (
            <Link className="link" to="/influencer">
              Find Influencers
            </Link>
        ),
        buttonLink: "/influencers",
      imageSrc: GIF1,
      imageAlt: "Gif",
      },
    },
    {
      value: "tab-3",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "AI-Powered Statistics",
      content: {
        badge: "",
        title: "Unlock AI-Powered Marketing Analytics.",
        description:
          "Leverage AI-driven insights to optimize your marketing strategy. Analyze trends, measure campaign performance, and make data-backed decisions.",
        buttonText: "Get AI Insights",
        buttonLink: "/ai-insights",
        imageSrc: GIF2,
        imageAlt: "Gif",
      },
    },
  ],
}) => {
  return (
    <section className="m_feature108">
      <div className="m_container">
        <div className="m_header">
          <Badge variant="outline">{badge}</Badge>
          <h1>{heading}</h1>
          <p>{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="m_tabs">
          <TabsList className="m_tabs-list">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="m_tabs-trigger"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="m_tabs-content">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="m_tabs-content-item m_content-grid"
              >
                <div className="m_content-text">
                  <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3>{tab.content.title}</h3>
                  <p>{tab.content.description}</p>
                  <Button as="a" href={tab.content.buttonLink} className="m_button" size="lg">
                    {tab.content.buttonText}
                  </Button>
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="rounded-xl"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Home;
