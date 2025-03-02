// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// // This is a mock implementation since we can't access real GPU stats in a browser environment
// // In a real application, this would connect to a system monitoring service or library
// export async function GET(request: Request) {
//   // const session = await getServerSession(authOptions)

//   // if (!session?.user) {
//   //   return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
//   //     status: 401,
//   //   })
//   // }
import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// This is a mock implementation since we can't access real GPU stats in a browser environment
// In a real application, this would connect to a system monitoring service or library
export async function GET(request: Request) {
  // const session = await getServerSession(authOptions);

  // if (!session?.user) {
  //   return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
  //     status: 401,
  //   });
  // }

  try {
    // Generate mock GPU stats
    const utilization = Math.floor(Math.random() * 100)
    const memoryTotal = 8 // GB
    const memoryUsed = Number.parseFloat((Math.random() * (memoryTotal - 0.5) + 0.5).toFixed(1))
    const temperature = Math.floor(50 + (utilization / 100) * 30)

    // Create a history array of 10 points
    const history = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))

    return NextResponse.json({
      utilization,
      memoryUsed,
      memoryTotal,
      temperature,
      history,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating GPU stats:", error)
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    })
  }
}
