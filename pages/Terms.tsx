
import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <div className="space-y-4 text-muted-foreground">
                <h2 className="text-2xl font-semibold text-foreground">1. Terms</h2>
                <p>By accessing the website at PLMS, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                <h2 className="text-2xl font-semibold text-foreground">2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on PLMS's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                <h2 className="text-2xl font-semibold text-foreground">3. Disclaimer</h2>
                <p>The materials on PLMS's website are provided on an 'as is' basis. PLMS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                 <h2 className="text-2xl font-semibold text-foreground">4. Limitations</h2>
                <p>In no event shall PLMS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PLMS's website.</p>
                 <h2 className="text-2xl font-semibold text-foreground">5. Governing Law</h2>
                <p>These terms and conditions are governed by and construed in accordance with the laws of Taiwan and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            </div>
        </div>
    );
};

export default Terms;
