FRONT-END LOAN — FIXED THROUGH APPLY LOAN

I corrected your uploaded Angular project for the Apply Loan stage.

Fixes applied:
1. Removed the SSR build settings that were causing Angular to look for server entry files.
2. Updated app.routes.ts to route to the real ApplyLoanComponent in pages/apply-loan/apply-loan.ts.
3. Updated app.config.ts to provide HttpClient and router for the API page, without SSR hydration.
4. Replaced the default Angular welcome placeholder in app.html with router-outlet, so the routed Apply Loan page can actually appear.
5. Kept the rest of your project files and existing Apply Loan form/service.

TO RUN ON YOUR WINDOWS COMPUTER:
1. Extract this ZIP.
2. Open the extracted Front-end-Loan folder in VS Code or a terminal.
3. If node_modules is not present (it is intentionally excluded from this source ZIP), run:
      npm install
4. Run:
      ng serve --open

API:
The Apply Loan service calls http://localhost:5087/api/ApplyLoan.
Make sure the API is running at that port and CORS allows http://localhost:4200.
If the API returns 401, it requires the valid JWT/login flow; that is an authentication issue, not a compilation issue.

NOTE:
The source files were corrected, but a full build could not be verified in this Linux environment because your uploaded node_modules contains Windows-specific esbuild binaries. This is an environment mismatch; on Windows, use your existing dependencies or run npm install if required.
