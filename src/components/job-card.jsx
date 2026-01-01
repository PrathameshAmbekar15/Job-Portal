// src/components/job-card.jsx
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { saveJob } from "@/api/apiJobs";
import { useState } from "react";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false, // initial saved state from backend
  onJobSaved = () => {} // callback to refresh saved jobs
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { fn: fnSavedJob, loading: loadingSavedJob } = useFetch(saveJob);
  const { user } = useUser();

  const handleSaveJob = async () => {
    if (!user) return;

    const previousState = saved; // current state before toggle
    const nextSavedState = !saved;

    // Optimistically update UI
    setSaved(nextSavedState);

    try {
      // Send previous state to backend
      await fnSavedJob({
        user_id: user.id,
        job_id: job.id,
        alreadySaved: previousState, // tells backend whether to insert or delete
      });
      onJobSaved(); // notify parent
    } catch (err) {
      console.error("Error saving/un-saving job:", err);
      // rollback UI if API fails
      setSaved(previousState);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon fill="red" size={18} className="text-red-300 cursor-pointer" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-center">
          {job.company && <img src={job.company.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        <p>{job.description}</p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>

        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? <Heart size={20} stroke="red" fill="red" /> : <Heart size={20} />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
