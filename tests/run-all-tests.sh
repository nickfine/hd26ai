#!/bin/bash

# Comprehensive Test Execution Script
# Runs all tests and generates a test report

echo "=========================================="
echo "HackDay Comprehensive Test Suite"
echo "=========================================="
echo ""

echo "Running automated tests..."
npm test -- --run --reporter=verbose

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "Automated tests completed."
echo "Please refer to TESTING_GUIDE.md for manual testing steps."
echo ""
echo "Next steps:"
echo "1. Review test results above"
echo "2. Execute manual testing checklist"
echo "3. Test in browser with Chrome DevTools"
echo "4. Verify cross-platform consistency"
echo ""
