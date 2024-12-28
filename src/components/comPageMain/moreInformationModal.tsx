
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { CalendarIcon } from 'lucide-react'
//interfaces
export interface EventCardProps {
    number: number
    title: string
    policyAxis: string
    startDate: string
    endDate: string
    description: string
    objective: string
    organizer: {
        name: string
        role: string
        avatar: string
    }
    image: string
}
export function EventCard({
    number,
    title,
    policyAxis,
    startDate,
    endDate,
    description,
    objective,
    organizer,
    image
}: EventCardProps) {
    return (
        <Card className="max-w-2xl overflow-hidden">
            <div className="relative h-48 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <span className="text-sm text-muted-foreground">N° {number}</span>
                </div>
                <div className="space-y-1">
                    <p className="font-medium">{policyAxis}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <time dateTime={startDate}>
                            {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                        </time>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <section className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </section>
                <section className="space-y-2">
                    <h3 className="font-semibold">Objetivo</h3>
                    <p className="text-sm text-muted-foreground">{objective}</p>
                </section>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={organizer.avatar} alt={organizer.name} />
                        <AvatarFallback>{organizer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-medium">{organizer.name}</p>
                        <p className="text-muted-foreground">{organizer.role}</p>
                    </div>
                </div>
                <Button>Participar</Button>
            </CardFooter>
        </Card>
    )
}

