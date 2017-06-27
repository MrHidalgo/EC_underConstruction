(function () {
    'use strict';

    angular
        .module('Eportfolio.student')
        .controller('student.kpb.controller', controller);

    angular
    .module('Eportfolio.teacher')
    .controller('teacher.kpb.controller', controller);
        controller.$inject = ["$scope", "$filter", "Upload", 'authService', 'dataService', '$sce'];

    function controller($scope, $filter, Upload, authService, dataService, $sce) {
        // options
        $scope.format = 'dd/MM/yyyy';
        $scope.formTitle = "KPB";
        $scope.maxPoints = 5;
        $scope.isNewForm = true; //todo
        $scope.genderName = authService.getCurrentUserGenderName();
        $scope.currentUserSpeciality = authService.getCurrentUserSpeciality();
        $scope.currentUserHospital = authService.getCurrentUserHospital();

        $scope.priorities = ["low", "medium", "hight"];
        $scope.ratings = [4, 5, 6, 7, 8, 9, 10];
        $scope.isTeacher = authService.isPTeacher();
        $scope.isCorrectPassword = true;
        $scope.oneAtATime = true;

        $scope.open = function () {
            $scope.popup.opened = true;
        };

        $scope.popup = {
            opened: false
        };

        //input data
        $scope.hospitalStudents = [{
            Email: "erer@.sdf.sd",
            UserTitle: {
                Id: 1,
                Name: "Mr"
            },
            Surname: "Kryientiy"
        }];

        $scope.hospitalTeachers = [{
            Email: "erer@.sdf.sd",
            UserTitle: {
                Id: 1,
                Name: "Doctor"
            },
            Surname: "Kryientiy"
        }
        ];

        $scope.kpbModel = {
            StudentName: $scope.genderName,
            Profession: $scope.currentUserSpeciality.Name,
            Level: $scope.currentUserSpeciality.Name,//todo
            HospitalId: $scope.currentUserHospital.Id,
            SpecialityId: $scope.currentUserSpeciality.Id,
            Hospital: $scope.currentUserHospital.Name,
            SupervisorName: $scope.genderName,
            CurrentTeacherEmail: null,
            AssesstmentDate: null,
            CurrentUserEmail: null,
            CreatedDate: $filter('date')(new Date(), $scope.format),
            Year: 1,//todo
            Semestr: 1,//todo
            //KpbId: 1,
            //EpaId: 1,
            //Description: "Description about  ....",

            //Age: 26,
            //Priority: "low",
            //Pathology: "something",

            //MedicalExpert: "5",
            //Communicator: "4",
            //Collaborator: "7",
            //Scholar: "9",
            //HealthAdvocate: "6",
            //Manager: "10",
            //Professional: "8",
            PositivePoints: [
                { Id: 0, Value: null },
                //{ Id: 2, Value: "ex" },
                //{ Id: 3, Value: "bad" }
            ],
            LerningPoints: [
              { Id: 0, Value: null },
              //{ Id: 2, Value: "eerx" },
              //{ Id: 3, Value: "erfg" }
            ],
            //SupervisorPassword: "123456",
            //GeneralConclusion: "7"
        }
        //$scope.CreatedDate = $scope.kpbModel.CreatedDate;
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            startingDay: 1
        };
        function disabled(data) {
            var date = data.date;
            var cdate = new Date(); // todo created date
            return date > cdate ? true : false;
        }

        $scope.files = [];

        init();

        function init() {

            getKpbs();
            getEpas();
            getHospitals();
        }
        //$scope.status.General = true;
        //methods
           

        function getKpbs() {
            return dataService.getKpbList().then(function (response) {
                $scope.kpbs = response.data;
                return $scope.kpbs;
            });
        }

        $scope.openCollapse = function (event, key) {
           
            if (event.target.className == 'panel-title') {
                $scope.status[key] = !$scope.status[key]
                return;
            }
            else {
                return;
            }
        }

        function getEpas() {
            return dataService.getEpaList().then(function (response) {
                $scope.epas = response.data;
                return $scope.epas;
            });
        }

        function getHospitals() {
            return dataService.getHospitals().then(function (response) {
                $scope.hospitals = response.data;
                return $scope.hospitals;
            });
        }

        function getSpecialities() {
            return dataService.getSpecialities().then(function (response) {
                $scope.specialities = response.data;
                return $scope.specialities;
            });
        }

        $scope.addNewPositivePoint = function ($index) {
            //console.log($index);
            //console.debug($scope.kpbModel.PositivePoints[$index]);
            if ($scope.kpbModel.PositivePoints != null
                && $scope.kpbModel.PositivePoints.length < $scope.maxPoints
                && $scope.kpbModel.PositivePoints.length - 1 == $index
                && ($scope.kpbModel.PositivePoints[$index].Value != null ||
                $scope.kpbModel.PositivePoints[$index].Value != "")
                ) {
                $scope.kpbModel.PositivePoints.push({ Id: $index + 1, Value: null });
            } else {
                if ($index + 1 != $scope.maxPoints &&
                    ($scope.kpbModel.PositivePoints[$index].Value == null
                    || $scope.kpbModel.PositivePoints[$index].Value == "")
                    && $scope.kpbModel.PositivePoints.length > 1
                   ) {
                        
                    $scope.kpbModel.PositivePoints.splice($index, 1);
                }
            }
        }

        $scope.addNewLerningPoint = function ($index) {
            //console.log($index);
            //console.debug($scope.kpbModel.LerningPoints[$index]);
            if ($scope.kpbModel.LerningPoints != null
                && $scope.kpbModel.LerningPoints.length < $scope.maxPoints
                && $scope.kpbModel.LerningPoints.length - 1 == $index
                && ($scope.kpbModel.LerningPoints[$index].Value != null ||
                $scope.kpbModel.LerningPoints[$index].Value != "")
                ) {
                $scope.kpbModel.LerningPoints.push({ Id: $index + 1, Value: null });
            } else {
                if ($index + 1 != $scope.maxPoints &&
                    ($scope.kpbModel.LerningPoints[$index].Value == null
                    || $scope.kpbModel.LerningPoints[$index].Value == "")
                    && $scope.kpbModel.LerningPoints.length > 1
                   ) {
                    $scope.kpbModel.LerningPoints.splice($index, 1);
                }
            }
        }

        $scope.status = {
            General: true,
            AssesstmentType: false,
            Assesstments: false,
            Feadback: false,
            Conslusion: false
        }
        $scope.save = function (files) {

        }
        $scope.send = function () {
            // console.log($scope.kpbModel)
        }

        $scope.delete = function (file) {
            var index = $scope.files.indexOf(file);
            $scope.files.splice(index, 1);
            //console.log($scope.files)
        }

        $scope.isRequiredRadio = function () {
            var editable = $scope.isTeacher || (!$scope.isTeacher && $scope.isCorrectPassword);

            //console.log(editable);

            return editable;
        }

        $scope.isRequiredFeedbackPositivePoint = function () {
            var isRequired = $scope.isRequiredRadio();
            if (isRequired) {

                if ($scope.kpbModel.PositivePoints[0].Value != null
                    || $scope.kpbModel.PositivePoints[0].Value != "") {
                    isRequired = false;
                } else {
                    isRequired = true;
                }
            }
            return isRequired;
        }


        $scope.isRequiredFeedbackLerningPoint = function () {
            var isRequired = $scope.isRequiredRadio();
            if (isRequired) {

                if ($scope.kpbModel.LerningPoints[0].Value != null
                    || $scope.kpbModel.LerningPoints[0].Value != "") {
                    isRequired = false;
                } else {
                    isRequired = true;
                }
            }
            return isRequired;
        }

        $scope.selectFiles = function ($files) {
            // console.log($files);
            $scope.files = $files;
        }


        $scope.changeFormTitle = function () {

            if ($scope.kpbModel.KpbId > 0) {

                $scope.formTitle = "KPB: " + $scope.kpbs[$scope.kpbModel.KpbId - 1].Name;
                changeAssessments($scope.kpbs[$scope.kpbModel.KpbId - 1].Id);
            }
            else {
                $scope.formTitle = "KPB";
                changeAssessments(1);
            }
        }

        $scope.tooltips = {
            MedicalExpert: $sce.trustAsHtml('<b >bla MedicalExpert</b>  '),
            Communicator: $sce.trustAsHtml('<b >bla Communicator</b>  '),
            Collaborator: $sce.trustAsHtml('<b >bla Collaborator</b>  '),
            Scholar: $sce.trustAsHtml('<b >bla Scholar</b>  '),
            HealthAdvocate: $sce.trustAsHtml('<b >bla HealthAdvocate</b>  '),
            Manager: $sce.trustAsHtml('<b >bla Manager</b>  '),
            Professional: $sce.trustAsHtml('<b >bla Professional</b>  '),
        };

        $scope.tooltipsVisibility = {
            MedicalExpert: false,
            Communicator: false,
            Collaborator: false,
            Scholar: false,
            HealthAdvocate: false,
            Manager: false,
            Professional: false,
        }

        function changeVisibility(MedicalExpert, Communicator, Collaborator, Scholar, HealthAdvocate, Manager, Professional) {

            $scope.tooltipsVisibility = {
                MedicalExpert: MedicalExpert,
                Communicator: Communicator,
                Collaborator: Collaborator,
                Scholar: Scholar,
                HealthAdvocate: HealthAdvocate,
                Manager: Manager,
                Professional: Professional,
            }
        }
        $scope.texts = [
             //Algemeen 1
            [
                '<p>De SEH-arts is bekwaam in de opvang en (eerste) behandeling van patiënten in alle leeftijdscategorieën met een acute zorgvraag. </p><p>De SEH-arts is bekwaam in de integrale benadering van de patiënt. Hiermee is de SEH-arts in staat om bij de ongedifferentieerde patiënt op efficiënte wijze een werkdiagnose en differentiële diagnose op te stellen.</p>'
                , '<p>De SEH-arts moet in staat zijn effectief te communiceren met patiënten en/of famiie en andere zorgverleners in de context van een acute presentatie. Dit vereist specifieke vaardigheden aangezien deze context vaak gepaard gaat met tijdsdruk, hectiek en potentieel levensbedreigende situaties.</p>'
                , '<p>De SEH-arts werkt doeltreffend samen met SEH-verpleegkundigen, poortartsen en andere zorgverleners in de multidisciplinaire teams die</p> <p>betrokken zijn bij de opvang en behandeling van patiënten met spoedeisende problematiek. </p><p>De SEH-arts heeft een coördinerende rol op de afdeling SEH.</p>'
                , '<p>De SEH-arts vervult een (voortrekkers)rol in de ontwikkeling van de SEHgeneeskunde, ondersteund door medisch wetenschappelijke kennis en gegevens uit de dagelijkse praktijk.</p>'
                , '<p>De SEH-arts is in staat om die (acute) ziektepresentaties van ziektebeelden te herkennen die de gezondheid van het individu en de samenleving in zijn geheel kunnen bedreigen.</p>'
                , '<p>De SEH-arts is in staat om de regie en coördinatie op een SEH-afdeling uit te oefenen met betrekking tot het stellen van prioriteiten en doelen, het maken van beleid en de inzet van middelen en medewerkers. </p> <p>De SEH-arts gaat op flexibele en slagvaardige wijze om met de wisselende en onvoorspelbare omstandigheden op de SEH.</p>'
                , '<p>In deze competentie komen de zes hiervoor beschreven competenties samen. Door de integratie van deze competenties bij het uitoefenen van het beroep SEH-arts wordt diens professionaliteit zichtbaar.</p>'
            ],
            //Airway 2
            ['<p>De SEH-arts:</p> <p>1. Is in staat een geobstrueerde luchtweg te herkennen.</p> <p>2. Is in staat met basale luchtwegtechnieken de luchtweg vrij te maken en te houden.</p>'
                , ''
                , '<p>De SEH-arts:</p> <p>1. Houdt rekening met de beschikbaarheid en toegankelijkheid van andere zorgverleners</p> <p>2. Respecteert en maakt gebruik van de expertise van andere specialismen</p>'
                , ''
                , ''
                , ''
                , '<p>De SEH-arts:</p> <p>1. Is in staat om ondanks de vaak hoge tijdsdruk en urgentie van handelen medische zorg op hoogstaand niveau te verlenen</p> <p>2. Kent en respecteert de grenzen van de eigen competenties</p>'

            ],
            //Breathing 3
            ['<p>De SEH-arts:</p> <p>1. Is in staat de eerste opvang te verrichten en de (eerste) behandeling te starten.</p> <p>2. Is in staat (eventueel met behulp van gerichte aanvullende diagnostiek) een uitgebreide differentiaal diagnose van dyspnoe en respiratoir falen op te stellen.</p>'
                , '<p>De SEH-arts:</p> <p>1. Weet ook onder tijdsdruk met aandacht te luisteren om vervolgens door gerichte vragen in korte tijd relevante patiënteninformatie te verkrijgen</p> <p>2. Zorgt dat gegevens van een patiëntenopvang voor de rest van de acute zorgketen beschikbaar zijn</p>'
                , ''
                , ''
                , '<p>De SEH-arts:</p> <p>1. Herkent atypische presentaties van acute ziektebeelden</p> <p>2. Herkent incidenten in de patiëntenzorg en tracht deze door bespreking en verbetering van processen hanteerbaar te maken</p>'
                , '<p>De SEH-arts:</p> <p>1. Past prioritering toe op nieuwe en urgente situaties</p> <p>2. Maakt gebruik van informatietechnologie voor het optimaliseren van de patiëntenzorg</p>'
                , ''
            ], 
            //Circulation 4
            ['<p>De SEH-arts:</p> <p>1.Is in staat om hoog-risico patiënten snel te identificeren, de eerste opvang te verrichten en de (eerste) behandeling te starten van patiënten met pijn op de borst, palpitaties en shock.</p> <p>2. Is in staat (eventueel met behulp van gerichte aanvullende diagnostiek) een uitgebreide differentiaal diagnose van pijn op de borst, palpitaties en shock op te stellen.</p> <p>3. Heeft hierbij speciale aandacht voor acuut levensbedreigende aandoeningen.</p> <p>4. Is in staat een cardiaal arrest te herkennen.</p> <p>5. Is in staat cardiopulmonale resuscitatie (CPR) op te starten rekening houdend met de overlevingsepidemiologie.</p> <p>6. Is in staat advanced cardiac life support (ACLS) te verrichten volgens de richtlijnen van de European Resuscitation Counsel (ERC), rekening houdend met lokale protocollen.</p> <p>7. Is specialist in de integrale en specialisme-overstijgende benadering van de patiënt. Hiermee is de SEH-arts in staat om (ook bij de ongedifferentieerde patiënt) op efficiënte wijze een werkdiagnose en differentiaaldiagnose op te stellen.</p> <p>8. Is specialist in de risicostratificatie van patiënten met een acute ongedifferentieerde zorgvraag</p>'
                , ''
                , '<p>De SEH-arts:</p> <p>1. Werkt intensief samen met SEH-verpleegkundigen, ieder vanuit hun eigen domein, bij de zorg voor patiënten op de SEH-afdeling.</p> <p>2. Werkt effectief samen binnen multidisciplinaire teams van wisselende samenstelling.</p> <p>3. Draagt duidelijk en tijdig, aan de juiste persoon en in de juiste vorm, de relevante patiëntgegevens over bij overdracht van verantwoordelijkheden van zorg, en controleert of de informatie zodanig is overgekomen.</p> <p>4. Verleent in teamverband en in nauwe samenwerking met andere zorgverleners zorg aan patiënten op de afdeling spoedeisende hulp.</p>'
                , ''
                , ''
                , '<p>De SEH-arts:</p> <p>1. Organiseert het zorgaanbod van acute patiënten.</p> <p>2. Is in staat meerdere dingen tegelijk te doen (multi-tasking).</p>'
                , ''
            ],
            //todo
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ]

        function setTexts(index) {
            $scope.tooltips.MedicalExpert = $sce.trustAsHtml('<div clas="tooltip-main">' + $scope.texts[index-1][0] + '</div>');
            $scope.tooltips.Communicator = $sce.trustAsHtml('<div clas="tooltip-main">' + $scope.texts[index - 1][1] + '</div>');
            $scope.tooltips.Collaborator = $sce.trustAsHtml('<div clas="tooltip-main">' + $scope.texts[index - 1][2] + '</div>');
            $scope.tooltips.Scholar = $sce.trustAsHtml('<div clas="tooltip-main">' + $scope.texts[index - 1][3] + '</div>');
            $scope.tooltips.HealthAdvocate = $sce.trustAsHtml('<div clas="tooltip-main">' + $scope.texts[index - 1][4] + '</div>');
            $scope.tooltips.Manager = $sce.trustAsHtml('<div clas="tooltip-main">' + $scope.texts[index - 1][5] + '</div>');
            $scope.tooltips.Professional = $sce.trustAsHtml('<div clas="tooltip-main">' + $scope.texts[index-1][6] + '</div>');

        }
        function changeAssessments(index) {
            setTexts(index);
            switch (index) {
                case 1:  //Algemeen
                    changeVisibility(false, false, false, false, false, false, false);
                    break;
                case 2: //Airway
                    changeVisibility(false, true, false, true, true, true, false);
                    break;
                case 3://Breathing
                    changeVisibility(false, false, true, true, false, false, true);
                    break;
                case 4: //Circulation
                    changeVisibility(false, true, false, true, true, false, false);
                    break;
                case 5://Disability
                    changeVisibility(false, false, true, true, true, true, true);
                    break;
                case 6://Exposure en environmental
                    changeVisibility(false, true, true, true, false, true, true);
                    break;
                case 7://Secondary assessment
                    changeVisibility(false, true, true, true, true, true, false);
                    break;
                case 8://Spoedeisende aandoeningen in het gelaat
                    changeVisibility(false, true, true, true, true, true, false);
                    break;
                case 9://Spoedeisende aandoeningen o.h.g.v. haemorrhagische diathese en metabole & endocrinologische aandoeningen
                    changeVisibility(false, true, true, true, true, false, true);
                    break;
                case 10://Spoedeisende dermatologische aandoeningen
                    changeVisibility(false, true, true, true, true, true, true);
                    break;
                case 11://Musculosketale aandoeningen
                    changeVisibility(false, true, true, true, true, true, false);
                    break;
                case 12://Gedragsstoornissen en psychiatrische aandoeningen
                    changeVisibility(false, false, true, true, true, true, true);
                    break;
                case 13://Huisartsgeneeskundige en "eerste lijns" aandoeningen
                    changeVisibility(false, false, false, true, false, false, true);
                    break;
                case 14://Geriatrie en sociale problematiek
                    changeVisibility(false, true, false, true, false, false, true);
                    break;
                case 15://Acute kindergeneeskunde
                    changeVisibility(false, false, true, true, false, true, false);
                    break;
                case 16://Pijnstilling en sedatie
                    changeVisibility(false, false, true, true, true, true, false);
                    break;
                case 17://Prehospitale acute hulpverlening en rampengeneeskunde
                    changeVisibility(false, true, false, true, false, false, true);
                    break;
                case 18://Traumatologie
                    changeVisibility(false, false, false, true, false, false, true);
                    break;
                case 19://Kennis en wetenschap
                    changeVisibility(true, false, true, false, true, true, false);
                    break;

            }
        }

    }

})();
