import { Alert } from "@mui/material";

interface StatusInfoPaneProps {
    isGameSuccessful: boolean;
    isGameUnsuccessful: boolean;
    errorMsg: string | null;
}

const StatusInfoPane = ({
    isGameSuccessful,
    isGameUnsuccessful,
    errorMsg,
}: StatusInfoPaneProps) => {

    return (
        <div>
            {errorMsg && (
                <Alert severity="error">
                    <div>
                        {errorMsg}
                    </div>
                </Alert>
            )}

            {isGameSuccessful && <Alert severity="success">
                Yay! All Done
            </Alert>}

            {isGameUnsuccessful && <Alert severity="info">
                Game Over! Click below to play again.
            </Alert>}

        </div>
    );
};

export default StatusInfoPane;